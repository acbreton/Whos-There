import React, {Component} from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import FBSDK from 'react-native-fbsdk';

const { 
  LoginButton,
  GraphRequest,
  AccessToken,
  GraphRequestManager 
} = FBSDK;
      
let myAccessToken;

class Login extends Component {

  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
      console.log(Object.keys(error)); 
      console.log(error.errorMessage);
    } else {
      data_json = JSON.stringify(result);
      console.log(data_json);
    } 
  }

  requestGraphAPI(){
    const infoRequest = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: 'name, location, taggable_friends'
          },
          access_token: {
            string: myAccessToken.toString()
          }
        }
      },
      this._responseInfoCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  render() {
    const { share, shareText } = styles;

    return (
      <View>

        <LoginButton
            publishPermissions={["publish_actions, user_location, user_friends"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert("Login failed with error: " + result.error);
                } else if (result.isCancelled) {
                  alert("Login was cancelled");
                } else {
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      myAccessToken = data.accessToken;
                      //this.testRequestGraphAPI(data.accessToken);
                    }
                  )
                  console.log(result);
                }
              }
            }
            onLogoutFinished={() => alert("User logged out")}/>

        <TouchableHighlight style={share}
            onPress={this.requestGraphAPI.bind(this)}>
            <Text style={shareText}>Info</Text>
        </TouchableHighlight> 

        <Text></Text>
      </View>
    );
  }
  
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  shareText: {
    fontSize: 20,
    margin: 10,
    color: 'black'
  },
  share: {
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default Login;