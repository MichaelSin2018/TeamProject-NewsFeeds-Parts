// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';
import { entity } from 'modules/Entities';
import ProfileImage from 'components/Post/ProfileImage';
import { timestampToDateString } from 'utils/date';
import { heading2BlackExtraBold, gray800, gray600 } from 'constants/Style';
import PlaceholderText from 'components/PlaceholderText';
import RemoveFix from 'components/NewsFeed/RemoveFix'

//Images
import unknownImg from "images/ic-unknown.png";


const Name = styled.Text`
  ${heading2BlackExtraBold};
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 1px;
  fontSize: 11px;
  font-weight: bold;
  line-height: 16px;
`;

const Date = styled.Text`
  margin-left: 4px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 1px;
  fontSize: 11px;
  line-height: 16px;
`;

const CommentText = styled(PlaceholderText)`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 14px;
  line-height: 24px;
  color: ${gray800};
`;

const ProfileImg = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 18px;
  margin-right: 8px;
  `;


class AllComments extends Component<Props, State> {
  state: State = {
    isLoading: true,
  };
  
  async componentWillMount() { 
    this.setState({ isLoading: false });
  }


  render() {
    
      const {post, comment, user, uId} = this.props;
      if (comment === null || user === null) {
        return null;
      } 
        
      return (
          <View style={{flexDirection: 'row'}}>
            <ProfileImg
            source={ (user.photoUrl && Boolean(user.photoUrl)) ? { uri: user.photoUrl } : unknownImg }
            />
            <View style={{flex: 1, flexWrap: 'wrap', }}>
              <View style={{flexDirection: 'row'}}>
                <Name>{user === undefined ? null : user.name}</Name>
                <Date>{comment ? timestampToDateString(comment.commentedAt) : null}</Date>
              </View>
              <CommentText>{comment.content}</CommentText>
              <RemoveFix post={post} comment={comment} user={user} />
            </View>
          </View>
      )
  }
}


export default connect((state, props) => {  
  return {
    user: entity("users").getItem(props.comment.userId)(state),
  }}, {
    fetchUser: entity('users').fetchItem,
  }, (state, dispatch, own) => {
    return {
      ...state,
      ...dispatch,
      ...own,
      fetchUserByUserId: dispatch.fetchUser(own.comment.userId),
    }  
  })(AllComments)

