from app.db import tasks_collection, logs_collection
from app.models import create_log

def recover_tasks():
    overdue_tasks = tasks_collection.find({"status": "pending"})

    for task in overdue_tasks:
        # simple reassignment logic
        task["owner"] = "manager"

        tasks_collection.update_one(
            {"_id": task["_id"]},
            {"$set": {"owner": task["owner"]}}
        )

        logs_collection.insert_one(create_log("REASSIGNED", task))