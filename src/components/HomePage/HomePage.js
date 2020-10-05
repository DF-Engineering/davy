import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";

import { auth } from "../../firebase";

import authentication from "../../services/authentication";

import EmptyState from "../EmptyState";

import { Home as HomeIcon } from "@material-ui/icons";

import { Button, Box } from "@material-ui/core";

import { ReactComponent as CabinIllustration } from "../../illustrations/cabin.svg";
import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";

import { authorizeAccount } from "../../actions/accountActions";

class HomePage extends Component {
  signInWithEmailLink = () => {
    const { user } = this.props;

    if (user) {
      return;
    }

    const emailLink = window.location.href;

    if (!emailLink) {
      return;
    }

    if (auth.isSignInWithEmailLink(emailLink)) {
      let emailAddress = localStorage.getItem("emailAddress");

      if (!emailAddress) {
        this.props.history.push("/");

        return;
      }

      authentication
        .signInWithEmailLink(emailAddress, emailLink)
        .then((value) => {
          const user = value.user;
          const displayName = user.displayName;
          const emailAddress = user.email;

          this.props.openSnackbar(
            `Signed in as ${displayName || emailAddress}`
          );
        })
        .catch((reason) => {
          const code = reason.code;
          const message = reason.message;

          switch (code) {
            case "auth/expired-action-code":
            case "auth/invalid-email":
            case "auth/user-disabled":
              this.props.openSnackbar(message);
              break;

            default:
              this.props.openSnackbar(message);
              return;
          }
        })
        .finally(() => {
          this.props.history.push("/");
        });
    }
  };

  // Add account
  handleOnTrigger = (e) => {
    e.preventDefault();
    this.props.authorizeAccount();
  };

  render() {
    const { user } = this.props;

    if (user) {
      if(user.emailVerified && (user.firstName || user.lastName || user.username)) {
        return <EmptyState 
        image={<CabinIllustration />} 
        title={`Welcome back, `+ user.firstName}
        description={process.env.REACT_APP_WELCOME_MESSAGE}
        button={
          <Button variant="outlined" color="primary" onClick={this.handleOnTrigger}>
          {/* <Button variant="outlined" color="primary" href={`${process.env.REACT_APP_STRIPE_OAUTH_URI}&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=${process.env.REACT_APP_STRIPE_CLIENT_SCOPE}&redirect_uri=${process.env.REACT_APP_STRIPE_REDIRECT_URI}`}> */}
            <Box clone mr={1}>
              <HomeIcon />
            </Box>
            Complete your application            
          </Button>
        }z
      />;
      } else {
        return <EmptyState 
        image={<CabinIllustration />} 
        title="Verify your Identity"
        description="Please complete your profile and verify your email to continue"
      />;
      }
    }

    return (
      <EmptyState
        image={<InsertBlockIllustration />}
        title={process.env.REACT_APP_DESCRIPTION}
        description={process.env.REACT_APP_DETAILED_DESCRIPTION}
      />
    );
  }

  componentDidMount() {
    this.signInWithEmailLink();
  }
}

HomePage.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  stripe: state.stripe
});

export default connect(
  mapStateToProps,
  { authorizeAccount }
)(withRouter(HomePage));
