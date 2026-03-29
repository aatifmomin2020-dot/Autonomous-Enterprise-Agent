import json
from app.db import tasks_collection
from app.models import create_task

def create_tasks(task_json):
    tasks = json.loads(task_json)

    inserted = []
    for t in tasks:
        task = create_task(t["title"], t["owner"], t["deadline"])
        result = tasks_collection.insert_one(task)
        task["_id"] = str(result.inserted_id)
        inserted.append(task)

    return inserted