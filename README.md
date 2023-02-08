# MUMU Season2 API Document


## Manual Installation

1.install docker desktop  

2.run command for clone
```bash
git clone https://github.com/mumuSeaosn2/Backend.git
cd Backend
```

3.change the db.config and delete the word .example in name

4.run command for docker
```bash
docker compose up -d --build
```

5.check out http://localhost:3000/api/docs/

## how to check db status


1.run this command
```
docker exec -it <container-name> bash
mysql -u <user> -p
<user password>
use <database name>

desc <table name>;
or
show tables;
```

## add dummy data
```
docker exec -it mumuseason2-api sh
npx sequelize-cli db:seed:all
```
## License

[MIT](LICENSE)
