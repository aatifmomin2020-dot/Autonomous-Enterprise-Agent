from datetime import datetime

def create_task(title, owner, deadline):
    return {
        "title": title,
        "owner": owner,
        "deadline": deadline,
        "status": "pending",
        "created_at": datetime.utcnow()
    }

def create_log(event, data):
    return {
        "event": event,
        "data": data,
        "timestamp": datetime.utcnow()
    }