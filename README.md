# PulseList — Modern Task Manager

Welcome to **PulseList**, your sleek and modern task management web application. PulseList provides an intuitive interface for creating, updating, and deleting tasks in real time. Built with Python (Flask), JavaScript (Vanilla JS), and SQLite (via SQLAlchemy), PulseList emphasizes simplicity, responsive design, and code clarity.

![pulselist](https://github.com/user-attachments/assets/95927413-d92c-4c66-801a-fdbde5763ac3)

---

### Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [File Structure and Responsibilities](#file-structure-and-responsibilities)
4. [Design Choices and Rationale](#design-choices-and-rationale)
5. [Getting Started](#getting-started)
6. [Next Steps](#next-steps)

---

## Project Overview

PulseList is designed as a lightweight, single-user task manager with a focus on a minimal footprint and fast iteration. It runs entirely in a local environment but can be easily containerized or extended for production deployment. The core objective of this project is to demonstrate a full-stack web application that integrates a Python backend with a JavaScript frontend and a relational database, all while adhering to modern development practices.

## Features

* **Add Tasks**: Quickly add new tasks using a simple input form.
* **Toggle Completion**: Mark tasks as completed with a checkbox; completed tasks appear crossed out and semi-transparent.
* **Delete Tasks**: Remove tasks with a single click on the delete button.
* **Real-Time Updates**: The task list updates automatically after any CRUD operation without requiring a page reload.
* **Error Handling**: Prevent empty task creation and return meaningful HTTP errors.
* **Responsive Design**: Adapts to mobile and desktop via Bootstrap 5.

---

## File Structure and Responsibilities

```
pulse_list/
├── README.md             # This documentation file
├── app.py                # Flask application: routes and request handling
├── models.py             # SQLAlchemy models and database initialization
├── requirements.txt      # Project dependencies
├── static/
│   ├── css/
│   │   └── styles.css    # Custom CSS overrides for Bootstrap
│   └── js/
│       └── main.js       # Frontend logic: fetch API calls and DOM updates
└── templates/
    └── index.html        # Main HTML template integrating Bootstrap and JS
```

* **README.md**: Provides an introduction, file descriptions, design decisions, and usage instructions.
* **app.py**: Defines the Flask server, configures the SQLite database, and implements RESTful API endpoints for tasks (`GET`, `POST`, `PUT`, `DELETE`). Uses `@before_first_request` to create tables on initial launch.
* **models.py**: Contains the `Task` model with `id`, `title`, and `completed` attributes, plus a `to_dict()` method for JSON serialization.
* **requirements.txt**: Pins `Flask>=2.0` and `Flask-SQLAlchemy` to ensure compatibility and simplicity.
* **templates/index.html**: Leverages Bootstrap’s CDN for CSS and JS, defines the page layout, and links to static assets.
* **static/css/styles.css**: Customizes typography and the appearance of task items (completed state styling).
* **static/js/main.js**: Implements asynchronous fetch calls to the Flask API, dynamically updates the DOM, and wires up event listeners for add, toggle, and delete actions.

---

## Design Choices and Rationale

1. **Flask + SQLAlchemy**: Flask was chosen for its lightweight nature and quick setup. SQLAlchemy provides an ORM layer that simplifies database interactions and can scale to larger databases if needed.

2. **SQLite Database**: For local development and simplicity, SQLite requires no external database server. The database file (`pulse_list.db`) is created automatically on first run.

3. **Bootstrap 5**: Adopting Bootstrap’s utility classes accelerates UI development and ensures a responsive layout out-of-the-box without complex custom CSS.

4. **Vanilla JavaScript**: While frameworks like React or Vue offer advanced state management, Vanilla JS was selected to keep dependencies minimal and to demonstrate raw fetch API usage. The code remains readable and easy to follow for beginners.

5. **Single HTML Template**: A single-page interface reduces complexity. All client-side interactions are handled via JavaScript, which communicates with the Flask backend over a RESTful API.

6. **RESTful API Patterns**: Clear separation of concerns—`GET /api/tasks` for reading, `POST` for creating, `PUT` for updating, `DELETE` for removal—aligns with industry standards and supports potential mobile or third-party integration.

7. **Error Handling**: Implemented input validation to prevent creation of empty tasks. Utilized Flask’s `abort()` to return HTTP 400 errors with descriptive messages.

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/the-shadow-0/PulseList.git
   cd PulseList
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**

   ```bash
   python app.py
   ```

   By default, the server listens at `http://localhost:5000`.

4. **Use the interface**

   * Enter a task description in the input field.
   * Click **Add** to create a task.
   * Check or uncheck the box to mark completion.
   * Click the **✕** button to delete a task.

---

## Next Steps

* **User Authentication**: Add user registration and login to support multiple user accounts.
* **Persistent Cloud Storage**: Replace SQLite with PostgreSQL or MySQL in a cloud environment.
* **Dockerization**: Create a `Dockerfile` and `docker-compose.yml` for containerized deployment.
* **UI Enhancements**: Migrate to a front-end framework (React/Vue) for complex interactions and state management.
* **Testing**: Integrate unit tests (pytest) for backend routes and end-to-end tests (Selenium) for UI flows.

Thank you for exploring PulseList! Feel free to submit issues or pull requests to improve this project.
