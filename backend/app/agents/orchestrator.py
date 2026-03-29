from datetime import datetime
from app.db import tasks_collection, logs_collection


def log_event(event, details):
    logs_collection.insert_one({
        "event": event,
        "details": details,
        "timestamp": datetime.utcnow()
    })


def validate(data):
    errors = []

    if "vendor_name" not in data:
        errors.append("Missing vendor_name")

    if "amount" not in data or data["amount"] <= 0:
        errors.append("Invalid amount")

    if "currency" not in data:
        errors.append("Missing currency")

    return errors


def recover(data, errors):
    if "Missing vendor_name" in errors:
        data["vendor_name"] = "AUTO_FIXED"

    if "Invalid amount" in errors:
        data["amount"] = abs(data.get("amount", 0))

    if "Missing currency" in errors:
        data["currency"] = "USD"

    return data


def execute(data):
    task = {
        "type": "invoice_processing",
        "status": "completed",
        "data": data,
        "created_at": datetime.utcnow()
    }

    tasks_collection.insert_one(task)
    return task


def run_pipeline(data):
    log_event("START", data)

    errors = validate(data)

    if errors:
        log_event("VALIDATION_FAILED", errors)
        data = recover(data, errors)
        log_event("RECOVERY_APPLIED", data)
    else:
        log_event("VALIDATION_SUCCESS", data)

    result = execute(data)
    log_event("EXECUTION_COMPLETED", result)

    return result