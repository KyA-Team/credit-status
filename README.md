# Application development and deploy

## Local development
Start app with docker compose with a local DB by running in the root of the project:
docker-compose up -d --build

If you ever need to change environment variables, you can do it in docker-compose.yml and then run the start command again to pick up the changes.

To view the logs for a particular service:

    docker-compose logs -f <service-name>

E.g.

    docker-compose logs -f credit-status-service
