package ie.gmit.sw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class ServiceDiscoveryServer {
    public static void main(String[] args) {
        // Tell server to look for application.properties or application.yml
        System.setProperty("spring.config.name", "application");
        SpringApplication.run(ServiceDiscoveryServer.class, args);
    }
}
