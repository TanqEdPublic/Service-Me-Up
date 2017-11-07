package ie.gmit.sw.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service("emailService")
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);
    private RestTemplate restTemplate;

    @Autowired
    public EmailService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Async("executor")
    public void sendEmail(String email, String token) {

        LOGGER.info("@@@@@@@@@@ Email Sender Service thread: "
                + Thread.currentThread().getName());

        // send email
        String appUrl = "${gateway.gateway-path}";// need change to zuul url later
        SimpleMailMessage registrationEmail = new SimpleMailMessage();
        registrationEmail.setTo(email);
        registrationEmail.setSubject("Registration Confirmation");
        registrationEmail.setText("To confirm your e-mail address, please click the link below:\n"
                + appUrl + "/verify/" + token);
        registrationEmail.setFrom("noreply@domain.com");

        String response = restTemplate.postForObject("${gateway.email-path}",
                                                    registrationEmail, String.class);


        LOGGER.info("###### Email Service response: " + response);

    }
}