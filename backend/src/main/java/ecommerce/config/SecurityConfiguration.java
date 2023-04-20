package ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests()
                .requestMatchers(new OrRequestMatcher(
                        new AntPathRequestMatcher("/api/userAddresses"),
                        new AntPathRequestMatcher("/api/orders"),
                        new AntPathRequestMatcher("/api/orderItems")
                )).authenticated()
                .requestMatchers(new OrRequestMatcher(
                        new AntPathRequestMatcher("/api"),
                        new AntPathRequestMatcher("/api/orders/search/findByOrderTrackingNumber")
                )).permitAll()
                .anyRequest().permitAll();
        http.oauth2ResourceServer().jwt();
        http.cors();
        http.csrf().disable();
        http.setSharedObject(ContentNegotiationStrategy.class,
                             new HeaderContentNegotiationStrategy());
        Okta.configureResourceServer401ResponseBody(http);
        return http.build();
    }
}
