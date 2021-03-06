package ie.gmit.sw.Service;

import ie.gmit.sw.Model.UserDetail;
import ie.gmit.sw.Repository.MongoDAO;
import ie.gmit.sw.domain.ProfileRequest;
import ie.gmit.sw.domain.ProfileResponse;
import ie.gmit.sw.domain.UserDetailFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    // set logger
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private MongoDAO mongoDB;

    // Before call this method, make sure all attributes in UserDetail is not null !
    @Override
    public ProfileResponse createUserDetail(ProfileRequest user) throws Exception {
        // save user details
        try {
            mongoDB.save(UserDetailFactory.create(user));
        } catch (Exception exc) {
            // Need to handle other exceptions here, like invalid entry to DB,
            // preferably on a Clients before sending Request
            logger.error("@@@ UserDetail failed to be saved... Reason: " + exc.getMessage() + " @@@");
        }
        logger.info("@@@ UserDetail: " + user.getEmail() + " is registered! @@@");
        return new ProfileResponse("create success !");
    }

    @Override
    public ProfileResponse updateUserDetail(ProfileRequest request) {
        UserDetail old_user = getUserByEmail(request.getEmail());
        if (old_user == null){
            mongoDB.save(UserDetailFactory.create(request));
            logger.info("@@@ UserDetail: " + request.getEmail() + " is added! @@@");
        }else{
            deleteUserDetail(request);
            mongoDB.save(UserDetailFactory.create(request));
            logger.info("@@@ UserDetail: " + request.getEmail() + " is updated! @@@");
        }

        return new ProfileResponse("update success !");
    }

    @Override
    public ProfileResponse deleteUserDetail(ProfileRequest request) {
        mongoDB.delete(getUserByEmail(request.getEmail()));
        logger.info("@@@ UserDetail: " + request.getEmail() + " is deleted! @@@");
        return new ProfileResponse("delete success !");
    }

    @Override
    public UserDetail getUserByEmail(String email) {
        return mongoDB.findByEmail(email);
    }

    @Override
    public List<Object> showAll() {
        return null;
    }
}
