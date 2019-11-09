# Application development and deploy

## Local development
Start app with docker compose with a local DB by running in the root of the project:
docker-compose up -d --build

If you ever need to change environment variables, you can do it in docker-compose.yml and then run the start command again to pick up the changes.

To view the logs for a particular service:

    docker-compose logs -f <service-name>

E.g.

    docker-compose logs -f credit-status-service

# TODO:
- Read about right handling of exceptions: https://expressjs.com/en/advanced/best-practice-performance.html
- Implement better validation for ids we receive (Should be able to handle different kinds of objects received and show errors)

### DONE:
- Create Service module
- Check modules being used in the generated app and add as needed
- Check DB integration: https://expressjs.com/en/guide/database-integration.html
- Investigate about auth https://github.com/expressjs/express/tree/master/examples/auth