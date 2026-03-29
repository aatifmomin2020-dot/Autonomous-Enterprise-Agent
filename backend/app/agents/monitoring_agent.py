from datetime import datetime
from app.db import tasks_collection, logs_collection
from app.models import create_log

def check_overdue_tasks():
    now = datetime.utcnow()

    overdue = tasks_collection.find({
        "deadline": {"$lt": now},
        "status": "pending"
    })

    for task in overdue:
        logs_collection.insert_one(create_log("OVERDUE", task))