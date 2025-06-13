from flask import Flask, render_template, request, jsonify, abort
from flask_migrate import Migrate
from models import db, Task
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pulse_list.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB and migrations
db.init_app(app)
migrate = Migrate(app, db)

# Ensure tables exist
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'POST':
        data = request.get_json() or {}
        title = data.get('title', '').strip()
        if not title:
            abort(400, 'Title cannot be empty')
        task = Task(
            title=title,
            description=data.get('description', '').strip(),
            due_date=(datetime.fromisoformat(data['due_date']) if data.get('due_date') else None),
            priority=data.get('priority', 'Normal')
        )
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201

    # GET with optional filters
    args = request.args
    status = args.get('status')  # 'all','completed','pending'
    priority = args.get('priority')
    query = Task.query
    if status == 'completed':
        query = query.filter_by(completed=True)
    elif status == 'pending':
        query = query.filter_by(completed=False)
    if priority:
        query = query.filter_by(priority=priority)
    tasks = query.order_by(
        Task.due_date.nullslast(),
        Task.priority.desc(),
        Task.id.desc()
    ).all()
    return jsonify([t.to_dict() for t in tasks])

@app.route('/api/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def modify_task(task_id):
    task = Task.query.get_or_404(task_id)
    if request.method == 'PUT':
        data = request.get_json() or {}
        task.title = data.get('title', task.title).strip() or task.title
        task.description = data.get('description', task.description)
        if 'completed' in data:
            task.completed = bool(data['completed'])
        if 'due_date' in data:
            task.due_date = (datetime.fromisoformat(data['due_date'])
                              if data['due_date'] else None)
        if 'priority' in data:
            task.priority = data['priority']
        db.session.commit()
        return jsonify(task.to_dict())
    db.session.delete(task)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)