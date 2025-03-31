class Environment {
     public getEnvironmentString = (key: String): string => {
        return process.env[String(key)] || '';
     }
     public getEnvironmentNumber = (key: String): string => {
        return process.env[String(key)] || '';
     }
     public getEnvironmentBoolean = (key: String): string => {
        return process.env[String(key)] || '';
     }
     public getEnvironmentObject = (key: String): string => {
        return process.env[String(key)] || '';
     }
     public getEnvironmentArray = (key: String): string => {
        return process.env[String(key)] || '';
     };
}

const environment = new Environment();

const MySQLDBConfig = {
    MYSQL_HOST: environment.getEnvironmentString('MYSQL_HOST'),
    MYSQL_DB_NAME: environment.getEnvironmentString('MYSQL_DB_NAME'),
    MYSQL_PORT: environment.getEnvironmentString('MYSQL_PORT'),
    MYSQL_USER: environment.getEnvironmentString('MYSQL_USER'),
    MYSQL_PASS: environment.getEnvironmentString('MYSQL_PASS'),
    MYSQL_CONNECTION_STR: environment.getEnvironmentString('MYSQL_CONNECTION_STR')
}

export { MySQLDBConfig }