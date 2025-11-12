package SGU.CEDD._C.demo.utils;

import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
public class DBConnection {
    @Value("${db.host}")
    private String host;
    @Value("${db.port}")
    private String port;
    @Value("${db.name}")
    private String name;
    @Value("${db.user}")
    private String user;
    @Value("${db.pass}")
    private String pass;

    public DBConnection() {
    }

    @Bean
    public DataSource getDBConnection() {
        DriverManagerDataSource source = new DriverManagerDataSource();
        source.setDriverClassName("com.mysql.cj.jdbc.Driver");
        source.setUrl("jdbc:mysql://" + this.host + ":" + this.port + "/" + this.name);
        source.setUsername(this.user);
        source.setPassword(this.pass);
        return source;
    }
}
