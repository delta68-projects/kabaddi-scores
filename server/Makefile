SHELL := /bin/fish

run_db:
	docker compose down
	docker compose up db 

run_app:
	source venv/bin/activate.fish
	rm -rf migrations
	python migrate.py 
	python app.py
