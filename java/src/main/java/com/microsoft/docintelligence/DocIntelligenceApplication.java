package com.microsoft.docintelligence;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
@Configuration(proxyBeanMethods = false)
public class DocIntelligenceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocIntelligenceApplication.class, args);
	}

}
