import React from 'react';
import { Container,  Image ,Button} from 'react-bootstrap';
import { MdPersonAddAlt } from "react-icons/md";
export const ProfileHeader = () => {
  return (
    <Container className="text-center my-3 container-profile Bagrond-Profils">
      <Image width="150px"  height="150px"
      src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg" roundedCircle className="mb-3" />
      <h1 className="text-light">John Doe</h1>
      <p className="lead text-light">Developer at Microsoft</p>
      <p className="text-light">Seattle, WA</p>
      <div>

              <Button variant="outline-light" className="custom-light-button" ><span> <MdPersonAddAlt size={19} />Ajouter</span> </Button>{' '}
        {/* <FaTwitter className="mx-1 icon-option "           
 /> */}
        {/* <FaFacebook className="mx-1 icon-option " />
        <FaLinkedin className="mx-1 icon-option " />
        <FaInstagram className="mx-1 icon-option " />
        <FaGithub className="mx-1  icon-option " /> */}
        
      </div>
       {/* <div>
      {/* Example usage with Link for internal paths 
      <Link to="!#" className="mx-1 ">
        <span className='icon-option'>        <FaTwitter />
</span>
      </Link>
      <Link to="!#" className="mx-1">
        <span className='icon-option'> <FaFacebook /></ span>
        
      </Link>
      <Link to="!#" >
                <span className='icon-option mx-1'>         <FaLinkedin />
</ span>

      </Link>
      <Link to="/instagram" >
         <span className='icon-option mx-1'>         <FaInstagram />
</ span>
        
      </Link>
      <Link to="/github" >
             <span className='icon-option mx-1'>          <FaGithub />
</ span>
       
      </Link>
    </div> */}
    </Container>
  );
};
