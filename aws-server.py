#!/usr/bin/env python3
"""
CampusCollab AWS Live Server & Database Client
Connects directly to your deployed AWS Lambda server and DynamoDB database.
"""
import sys, json, boto3, warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*PythonDeprecationWarning.*")
try:
    from boto3.compat import PythonDeprecationWarning
    warnings.filterwarnings("ignore", category=PythonDeprecationWarning)
except Exception:
    pass

REGION = "us-east-1"
FUNCTION_NAME = "workshop-campuscollab-server"
TABLE_NAME = "workshop-campuscollab-db"

lambda_client = boto3.client('lambda', region_name=REGION)
dynamo_resource = boto3.resource('dynamodb', region_name=REGION)
table = dynamo_resource.Table(TABLE_NAME)

def print_help():
    print("""
Usage: python3 aws-server.py <command> [arguments]

Commands:
  health                     Check AWS server and database status
  students [list|add]        Query or add students in DynamoDB
  projects [list]            Query projects in DynamoDB
  events [list]              Query events in DynamoDB
  stats                      Display database item counts and table details
""")

def handle_health():
    res = lambda_client.invoke(FunctionName=FUNCTION_NAME, Payload=json.dumps({'action': 'health'}))
    print(json.dumps(json.loads(res['Payload'].read().decode('utf-8')), indent=2))

def handle_students(args):
    subcmd = args[0] if args else 'list'
    if subcmd == 'list':
        res = lambda_client.invoke(FunctionName=FUNCTION_NAME, Payload=json.dumps({'action': 'students'}))
        payload = json.loads(res['Payload'].read().decode('utf-8'))
        print(f"Total Students: {payload.get('count', 0)}")
        for s in payload.get('students', []):
            skills = ", ".join(s.get('skills', []))
            print(f"  • {s.get('name')} ({s.get('primaryRole', 'Student')}) - {s.get('college')} | Skills: [{skills}]")
    elif subcmd == 'add':
        name = input("Enter student name: ")
        college = input("Enter college/university: ")
        role = input("Enter primary role (e.g. Frontend, ML, Designer): ")
        skills = input("Enter comma-separated skills: ").split(',')
        skills = [s.strip() for s in skills if s.strip()]
        payload = {
            'action': 'students',
            'httpMethod': 'POST',
            'body': {
                'name': name,
                'college': college,
                'primaryRole': role,
                'skills': skills
            }
        }
        res = lambda_client.invoke(FunctionName=FUNCTION_NAME, Payload=json.dumps(payload))
        print("Response:", res['Payload'].read().decode('utf-8'))

def handle_projects():
    res = lambda_client.invoke(FunctionName=FUNCTION_NAME, Payload=json.dumps({'action': 'projects'}))
    payload = json.loads(res['Payload'].read().decode('utf-8'))
    print(f"Total Projects: {payload.get('count', 0)}")
    for p in payload.get('projects', []):
        tags = ", ".join(p.get('tags', []))
        print(f"  • {p.get('title')} [{p.get('category')}] | Tags: {tags}")

def handle_stats():
    desc = table.meta.client.describe_table(TableName=TABLE_NAME)
    info = desc['Table']
    print(f"AWS Table: {info['TableName']}")
    print(f"Status: {info['TableStatus']}")
    print(f"ARN: {info['TableArn']}")
    print(f"Item Count: {info['ItemCount']}")
    print(f"Size: {info['TableSizeBytes']} bytes")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print_help()
        sys.exit(0)
    cmd = sys.argv[1].lower()
    if cmd == 'health':
        handle_health()
    elif cmd == 'students':
        handle_students(sys.argv[2:])
    elif cmd == 'projects':
        handle_projects()
    elif cmd == 'stats':
        handle_stats()
    else:
        print(f"Unknown command: {cmd}")
        print_help()
