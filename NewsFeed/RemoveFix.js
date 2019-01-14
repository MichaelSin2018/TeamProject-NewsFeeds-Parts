// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { entity } from 'modules/Entities';
import Authorization from 'components/Common/Authorization';
import afterAlertConfirm from 'components/Common/afterAlertConfirm';
import { heading2BlackExtraBold, gray800, gray600 } from 'constants/Style';
import { getMyUser } from "modules/User";


const Like = styled.Text`
  margin-left: 10px;
  margin-right: 2px;
  margin-bottom: 10px;
  fontSize: 10px;
  color: ${gray600};
`;

const Loading = styled.ActivityIndicator`
  margin: 24px 0
`;


class RemoveFix extends Component<Props, State> {
  state: State = {
    isLoading: true,
  };
  
  async componentWillMount() { 
    this.setState({ isLoading: false });
  }

  handleClickDelete = () => {
    const { comment: { id: commentId }, deleteComment} = this.props;

    afterAlertConfirm('정말로 삭제하시겠습니까?')
      .then(() => {
        deleteComment(commentId);
      });
  }

  
  render() {

    console.log('RemoveFix this.prop: ', this.props)

    const {user, uId} = this.props;
      if (user === null) {
        return null;
      } 
        
      return (
          <View style={{flexDirection: 'row'}}>
            {user.id === uId.id ? 
            <TouchableOpacity onPress={ this.handleClickDelete }><Like>삭제</Like></TouchableOpacity>
            : null }
            {user.id === uId.id ? 
            <TouchableOpacity><Like>수정</Like></TouchableOpacity> 
            : null }
          </View>
      )
  }
}


export default connect((state, props) => {  
  return {
    uId: getMyUser(state)
  }}, {
    deleteComment: entity('comments').deleteItem,
  }, (state, dispatch, own) => {
    return {
      ...state,
      ...dispatch,
      ...own,
    }  
  })(RemoveFix)

