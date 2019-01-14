// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { entity } from 'modules/Entities';
import { gray800, gray600 } from 'constants/Style';
import { orderBy } from 'lodash';
import FeedPost from 'components/NewsFeed/FeedPost'


class FeedCommentItem extends Component<Props, State> {
  state: State = {
    isLoading: true,
  };
  
  async componentWillMount() { 
    this.setState({ isLoading: false });
  }

  render() {
      const {comment, user, post, uId} = this.props;

      if (post === null) {
        return null;
      } 
      
      return (
        <View style={{marginBottom: 20}}>
          <FeedPost comment={comment} postId={comment.postId} post={post} name={user.name} commentor={user} uId={uId} />
        </View>
      )
  }
}


export default connect((state, props) => {  
  return {                            
    post: entity("posts").getItem(props.comment.postId)(state), 
    user: entity("users").getItem(props.comment.userId)(state),
  }
}, {
  fetchPost: entity('posts').fetchItem,
  fetchUser: entity('users').fetchItem,
}, (state, dispatch, own) => {
  return {
    ...state,
    ...dispatch,
    ...own,
    fetchPostByPostId: dispatch.fetchPost(own.comment.postId),
    fetchUserByUserId: dispatch.fetchUser(own.comment.userId),
  }  
})(FeedCommentItem)
