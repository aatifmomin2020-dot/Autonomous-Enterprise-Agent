from fastapi import APIRouter
from app.agents.orchestrator import run_pipeline
from app.db import tasks_collection, logs_collection

router = APIRouter()


@router.post("/process-meeting")
def process(data: dict):
    result = run_pipeline(data)
    return {"result": result}


@router.get("/tasks")
def get_tasks():
    tasks = list(tasks_collection.find().sort("created_at", -1))

    for t in tasks:
        t["_id"] = str(t["_id"])

    return tasks


@router.get("/logs")
def get_logs():
    logs = list(logs_collection.find().sort("timestamp", -1).limit(100))

    for l in logs:
        l["_id"] = str(l["_id"])

    return logs