import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './App';

//////////////////////MATERIAL UI/////////////////////////////////
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
import { TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

//PASS EXPANDMORE THROUGH PROPS FROM PARENT
const ExpandMore = styled((props: ExpandMoreProps) => {
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
  handleEditClick(id): void;
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
}

const Event = ({ event, handleEditClick, getAllEvents }: AppProps) => {
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const user: { roleId: number; id: number } = useContext(UserContext);
  const { id } = user;
  const [expanded, setExpanded] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [totalRsvp, setTotalRsvp] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(0);
  // const [numAttend, setNumAttend] = useState(0);
  const { roleId } = user;

  ////////???????POSTS AN RSVP FROM USER IN THE DB???????///////////////////////
  const handRSVPosts = () => {
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
  };
  //////?????????DELETE User RSVP???????????????????///////
  const deleteRsvpsEvent = () => {
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
  };

  ////////////////////////////////////////////
  useEffect(() => {
    getUserRsvpCount();
    totalEventRsvps();
  }, [updateCounter]);

  return (
    <Card
      sx={{
        minWidth: 300,
        borderRadius: '1.2rem',
        boxShadow: 8,
        size: 'large',
      }}
      className='texture1'
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
        <Typography
          variant='body2'
          color='text.secondary'
          fontWeight='700'
          fontSize='20px'
        >
          {`Address: ${event.location}`}
        </Typography>
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
                  ? `Going:  ${totalRsvp}`
                  : `Going:  ${totalRsvp}`
              }`
            : `RSVPS: ${totalRsvp}`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
        <Stack spacing={5} direction='row' id='product_card_stack'>
          <ExpandMore sx={{ color: 'green' }} expand={expanded}>
            {roleId > 3 && (
              <DeleteIcon sx={{ color: 'green' }} onClick={deleteEvent} />
            )}
          </ExpandMore>
          <ExpandMore sx={{ color: 'green' }} expand={expanded}>
            {roleId < 4 && (
              <Button onClick={handRSVPosts} color='success' size='large'>
                {isGoing ? (
                  <CheckIcon color='success' fontSize='large'></CheckIcon>
                ) : (
                  'RSVP'
                )}
              </Button>
            )}
          </ExpandMore>
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
        <Typography paragraph margin='2.3rem' fontWeight='700' fontSize='18px'>
          {' '}
          {`Description: ${event.description}`}
        </Typography>
      </Collapse>
    </Card>
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
