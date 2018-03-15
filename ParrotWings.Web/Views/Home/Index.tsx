import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardTitle, CardText, CardActions, FlatButton as Button } from 'material-ui';

export class Index extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);

    this.state = {
     
    };
  }

  render() {
    return (
      <Card>
        <CardMedia>
          <div style={{ height: '15vw', backgroundImage: 'url(images/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </CardMedia>
        <CardTitle title="Parrot Wings" subtitle="Innovative payment network and a new kind of money" />
        <CardText>
          Parrot Wings is innovative payment network and a new kind of money. 
          Parrot Wings uses a database to store transactions.
          The Parrot Wings source code is compiled and hidden from prying eyes.
          Someone owns and controls Parrot Wings, but no one knows who it is.
          Join, it's free!
        </CardText>
        <CardActions>
          <Button href="/join" label="Join now!"
            primary labelStyle={{ fontSize: 'xx-large', textTransform: 'none' }}
          />
        </CardActions>
      </Card>
    );
  }

}