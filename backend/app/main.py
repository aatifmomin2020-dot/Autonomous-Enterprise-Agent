from apscheduler.schedulers.background import BackgroundScheduler
from app.agents.monitoring_agent import check_overdue_tasks
from app.agents.recovery_agent import recover_tasks

scheduler = BackgroundScheduler()
scheduler.add_job(check_overdue_tasks, "interval", seconds=30)
scheduler.add_job(recover_tasks, "interval", seconds=60)
scheduler.start()