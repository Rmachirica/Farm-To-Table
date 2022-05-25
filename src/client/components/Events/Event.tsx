// Import Dependencies
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import swal from 'sweetalert';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import GoogleCalendar from './GoogleCalendar';

// MUI Imports
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Link } from 'react-router-dom';
import EventMapPage from './EventMapPage';
import LocationOnIcon from '@mui/icons-material/LocationOn';
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

//PASS EXPANDMORE THROUGH PROPS FROM PARENT
const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface AppProps {
  handleEditClick(id: number): void;
  getAllEvents(): void;
  event: {
    eventName: string;
    eventType: string;
    id: number;
    eventDate: string;
    description: string;
    location: string;
    thumbnail: string;
  };
  lat: string;
  lon: string;
  updateCoords(): void;
  mode: string;
}

const Event = ({ event, handleEditClick, getAllEvents }: AppProps) => {
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // console.log('LINE 74', event);
  const user: { roleId: number; id: number } = useContext(UserContext);
  const { id } = user;
  const [expanded, setExpanded] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [totalRsvp, setTotalRsvp] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(0);
  // const [numAttend, setNumAttend] = useState(0);
  const { roleId } = user;

  const pages = { name: 'Events', path: '/eventmap-page' };

  ////////???????POSTS AN RSVP FROM USER IN THE DB???????///////////////////////
  const handRSVPosts = () => {
    swal({}).then((isGoing) => {
      if (isGoing) {
        swal('We look forward to seeing you there!', {
          icon: 'success',
        });
        axios
          .post('/api/rsvps/', {
            userId: id,
            eventId: event.id,
          })
          .then(() => {
            setIsGoing(true);
          })
          .then(() => {
            totalEventRsvps();
            getAllEvents();
          })
          .catch((err) => {
            console.error('68 REQUEST FAILED', err);
          });
      }
    });
  };

  /////////////??????????GETS THE RSVP COUNT FOR A USER?????////////////////
  const getUserRsvpCount = () => {
    axios
      .get(`/api/rsvps/${id}`, {
        params: { userId: id, eventId: event.id },
      })
      .then(({ data }) => {
        if (data.length > 0) {
          setIsGoing(true);
        } else {
          setIsGoing(false);
        }
      })
      .catch((err) => {
        console.error('a blunder occured', err);
      });
  };

  /////???GETS THE COUNT OF ALL RSVPS FOR A GIVEN EVENT IN DB????///////////
  const totalEventRsvps = () => {
    axios
      .get(`/api/rsvps/total/${event.id}`, { params: { eventId: event.id } })
      .then((data) => {
        setTotalRsvp(data.data.length);
      })
      .catch((err) => {
        console.log('135 rsvps error', err);
      });
  };

  //??????DELETES A GIVEN EVENT ??????/////////////////////////
  const deleteEvent = () => {
    swal({
      title: 'Are you sure?',
      text: 'Event will be deleted, along with all users RSVPs!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('Event has been deleted', {
          icon: 'success',
        });
        axios
          .delete(`/api/events/${event.id}`, {
            params: { id: event.id },
          })
          .then(() => {
            getAllEvents();
          })
          .catch((err) => {
            console.error('91 REQUEST FAILED', err);
          });
      } else {
        swal('That was a close one!');
      }
    });
  };
  //////?????????DELETE User RSVP???????????????????///////
  const deleteRsvpsEvent = () => {
    swal({
      title: 'Are you sure?',
      text: 'You will be missed!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('RSVP has been deleted', {
          icon: 'success',
        });
        axios
          .delete(`/api/rsvp/delete/${id}`, {
            params: { userId: id, eventId: event.id },
          })
          .then(() => {
            setUpdateCounter(updateCounter + 1);
            totalEventRsvps();
          })
          .catch((err) => {
            console.error('91 REQUEST FAILED', err);
          });
      } else {
        swal('That was a close one!');
      }
    });
  };

  ////////////////////////////////////////////
  useEffect(() => {
    getUserRsvpCount();
    totalEventRsvps();
  }, [updateCounter]);

  return (
    //Reconfiguring the card margins
    <Box marginTop='-130px'>
      <ToastContainer
        position='bottom-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Card
        sx={{
          minWidth: '15rem',
          borderRadius: '1.2rem',
          boxShadow: 8,
          size: 'large',
          marginTop: '100px',
        }}
        className='texture2'
      >
        <CardHeader fontWeight='700' title={event.eventName} />
        <CardContent>
          <Typography
            variant='body2'
            color='text.secondary'
            fontWeight='700'
            fontSize='20px'
          >
            {`Date of Event: ${event.eventDate}`}
          </Typography>
        </CardContent>

        <CardContent>
          <Typography
            variant='body2'
            color='text.secondary'
            fontWeight='700'
            fontSize='20px'
          >
            {`Type: ${event.eventType}`}
          </Typography>
        </CardContent>
        <CardContent>
          <Button
            component={Link}
            // variant='contained'
            color='info'
            to={`${pages.path}`}
            state={{ event }}
            size='large'
          >
            <LocationOnIcon>{event.location}</LocationOnIcon>
          </Button>
          {/* <Link to={`${pages.path}`} state={{ event }}>
            <LocationOnIcon>{event.location}</LocationOnIcon>
          </Link> */}
        </CardContent>

        {event.thumbnail ? (
          <CardMedia component='img' height='300' image={event.thumbnail} />
        ) : (
          ''
        )}
        <CardContent>
          <Typography paragraph fontWeight='700' fontSize='20px'>
            {user.roleId < 4
              ? `${
                  totalRsvp === 1
                    ? `Total going:  ${totalRsvp}`
                    : `Total going:  ${totalRsvp}`
                }`
              : `RSVPS: ${totalRsvp}`}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
          <Stack spacing={5} direction='row' id='product_card_stack'>
            <ExpandMore sx={{ color: 'green' }} expand={expanded}>
              {roleId > 3 && (
                <Button>
                  <DeleteIcon sx={{ color: 'green' }} onClick={deleteEvent} />
                </Button>
              )}
            </ExpandMore>
            {/* <ExpandMore sx={{ color: 'green' }} expand={expanded}> */}
            {roleId < 4 && (
              <Button
                sx={{
                  '&:hover:before': { content: `"Going"` },
                  position: 'top',
                  width: 80, //necessary for replacing text
                }}
                onClick={handRSVPosts}
                color='success'
                size='medium'
                variant='outlined'
              >
                {isGoing ? (
                  <CheckIcon color='success' fontSize='large'></CheckIcon>
                ) : (
                  'RSVP'
                )}
              </Button>
            )}
            {/* </ExpandMore> */}
            {roleId > 3 && (
              <ExpandMore
                sx={{ color: 'green' }}
                expand={expanded}
                onClick={() => handleEditClick(event.id)}
              >
                <EditIcon sx={{ color: 'green' }} />
              </ExpandMore>
            )}

            {roleId < 4 && (
              <ExpandMore
                sx={{ color: 'green' }}
                expand={expanded}
                onClick={() => deleteRsvpsEvent()}
              >
                <DeleteIcon sx={{ color: 'green' }} />
              </ExpandMore>
            )}
            <ExpandMore
              sx={{ color: 'green' }}
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Stack>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          {' '}
          <Typography
            paragraph
            margin='2.3rem'
            fontWeight='700'
            fontSize='18px'
          >
            {' '}
            {`Description: ${event.description}`}
          </Typography>
        </Collapse>
      </Card>
      {/* <GoogleCalendar /> */}
    </Box>
  );
};

export default Event;

{
  /* <ExpandMore sx={{ color: "green" }} expand={expanded}>
            {roleId < 4 && (
              <Icon
                baseClassName="fas"
                className="fa-plus-circle"
                fontSize="medium"
                onClick={handRSVPosts}
              >
                Go
              </Icon>
            )}
          </ExpandMore> */
}

// avatar={
//   <Avatar
//     sx={{ bgcolor: red[500] }}
//     aria-label="recipe"
//     font-Size="12px"
//   >
//     {event.eventName[0]}
//   </Avatar>
// }

// const check = () => {
//   if (user.roleId < 4) {
//     isGoing ? "You are going" : "Not going";
//   } else {
//     return null;
//   }
// };
