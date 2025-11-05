# Todo App (Flask + Tailwind + Vanilla JS)

A minimalist Todo application with a glassmorphism UI. Tasks are added, edited, marked done, and deleted entirely on the client, with persistence via localStorage. A progress bar reflects completion in real time. A white modal prevents adding empty tasks.

## Features
- Add tasks via button or Enter
- Edit, Done, and Delete actions per task
- Progress bar + percentage of completed tasks
- White modal popup when input is empty (backdrop click and Esc to close)
- Centered frosted-glass task card, header input stays accessible
- Zero backend state — data stored in the browser (localStorage)

## Tech Stack
- Flask (templates/static serving)
- Tailwind (via CDN)
- Vanilla JavaScript

## Project Structure
```
app/
  app.py                 # Flask entrypoint (current)
  templates/
    base.html            # Main UI template (glass card + modal)
  static/
    app.js               # Todo logic (add/edit/done/delete, progress, modal)
    input.css            # Custom styles (loaded in base.html)
```

## Prerequisites
- Python 3.10+
- pip

## Setup
```bash
pip install flask
```

## Run (current setup)
```bash
python -m app.app
```
This starts the server on `http://0.0.0.0:5555`.

If you see a TemplateNotFound error for `index.html`, either:
1) Create a minimal `app/templates/index.html` that uses the main UI:
```html
{% extends 'base.html' %}
```
…or…
2) Update the route in `app/app.py` to render `base.html` instead of `index.html`.

## Using the App
- Type your task in the input at the top and press Enter or click Add.
- Each task row has: Edit, Done, Delete.
- The progress bar and percentage update as you mark tasks done.
- Adding with an empty input opens a white modal; close with OK, Close, Esc, or backdrop click.

## Styling
- The task list card uses glassmorphism (`bg-white/10` + `backdrop-blur` + subtle border and shadow).
- The empty-task modal uses a white card with dark text for contrast.
- Tailwind is included via CDN in the template for rapid styling changes.

## Customization
- Change the look/feel in `app/templates/base.html` and `app/static/input.css`.
- Adjust button styles and behavior in `app/static/app.js` (render + handlers).

## Future Enhancements
- Server-side persistence (e.g., Flask + SQLAlchemy + REST API)
- User accounts and multi-device sync
- Due dates, categories, and filtering
- Unit tests and CI

## License
MIT


