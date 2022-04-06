# MUMU Season2 API Document


## Manual Installation

1.install docker desktop  

2.run command for clone
```bash
git clone https://github.com/mumuSeaosn2/Backend.git
cd Backend
```

3.chanege the db.config and delete the word .example in name

4.run command for docker
```bash
docker-compose up -d --build
```

5.chekdout http://localhost:3000/api/docs/

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
## License

[MIT](LICENSE)
