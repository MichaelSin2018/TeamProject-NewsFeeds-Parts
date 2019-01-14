// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, View, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';
import { entity } from 'modules/Entities';
import ProfileImage from 'components/Post/ProfileImage';
import { heading2BlackExtraBold, gray800, gray600, gray200, white } from 'constants/Style';
import { addComment } from 'modules/Feed';
import { getMyUser } from 'modules/User';
import KeyboardAvoidingView from 'components/Common/KeyboardAvoidingView';

//Images
import unknownImg from "images/ic-unknown.png";
import addImg from 'images/ic-plus-black.png';


const Loading = styled.ActivityIndicator`
  margin: 24px 0
`;

const CommentForm = styled.View`
  margin-bottom: 16px;
  width: 100%;
  border-left-width: 0;
  border-right-width: 0;
  border-bottom-width: 0;
  background-color: ${white};
  flex-direction: row;
  align-items: center;
`;
// border: solid 1px ${gray200};
// padding: 8px 16px;


const BorderContainer = styled.View`
  flex: 1;
  border-radius: 20px;
  background-color: #f9f9fb;
  border: solid 1px #e0e2e6;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const InputComment = styled.TextInput`
  flex: 1;
  padding: 8px 8px 8px 16px;
  font-size: 14px;
  color: ${gray800};
  border-width: 0;
  border-color: #f9f9fb;
  justify-content: flex-start;
`;


const ProfileImg = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 18px;
  margin-right: 8px;
  `;

const AddBtn = styled.Image`
  width: 24px;
  height: 24px;
  justify-content: flex-end;
  margin-right: 16px;
`;

class InputMyComment extends Component<Props, State> {
  //1. without constructor
  // state: State = {
  //   isLoading: true,
  //   comment: null,
  //   isLoadingComment: false,
  // };
  // input = null;

  // 2. with constructor
  constructor() {
    super();
    this.state = {
      comment: null,
      isLoadingComment: false,
    };
    this.scrollView = null;
    this.input = null;
  }

  
  componentWillMount() {
    this.setState({ isLoading: false });
  }

  // componentDidMount() {
  //   this.input.focus();
  // }
  
  // componentWillUnmount() {
  //   Keyboard.dismiss();
  // }
  
  //1. without constructor
  // setTextInputRef = (ref) => {
  //   this.input = ref;
  // }

  // setScrollViewRef = (ref) => {
  //   this.scrollView = ref;
  // }

  //2. with constructor
  setTextInputRef = (ref) => {
    this.input = ref;
  }

  setScrollViewRef(ref) {
    this.scrollView = ref;
  }

  scrollToInputCursor = () => {
    if (this.scrollView) {
      if (IS_IOS) {
        this.scrollView.scrollToEnd({ animated: true });
      } else {
        setTimeout(() => {
          if (this.scrollView) {
            this.scrollView.scrollToEnd({ animated: false });
          }
        }, 200);
      }
    }
  }

  handleChangeComment = (text) => {
    this.setState({ comment: text });
  }

  handleClickAddComment = () => {
    const { addComment, post, myUser } = this.props;
    const { comment } = this.state;

    if (!comment || comment.length <= 0) {
      Alert.alert('알림', '글을 입력해주세요.');
      return;
    }

    this.setState({ isLoadingComment: true });
    addComment({
      userId: `${myUser.id}`,
      postId: `${post.id}`,
      content: `${comment}`
    })
    .then(commentId => console.log('commentId:', commentId))
    .then(() => {
        this.scrollToInputCursor();
        this.setState({ comment: null, isLoadingComment: false });
      })
      .catch((err) => {
        Alert.alert('알림', `작성에 실패했습니다. \n${err}`);
        this.setState({ isLoadingComment: false });
      });
      
  }

  render() {
    const { myUser } = this.props;
    const { isLoadingComment } = this.state;
    const { photoUrl: myPhotoUrl } = myUser;

    console.log('InputMyComment this.props', this.props)
    console.log('InputMyComment this.state', this.state)
     
    return (
      <View style={{flexDirection: 'column'}}>
        <CommentForm>
          <ProfileImg
            source={ (myPhotoUrl && Boolean(myPhotoUrl)) ? { uri: myPhotoUrl } : unknownImg }
          />
          <BorderContainer>
            <InputComment
              innerRef={ this.setTextInputRef }
              placeholder="댓글을 입력해주세요."
              multiline
              placeholderTextColor="#a8aeb3"
              underlineColorAndroid="#f9f9fb"
              onFocus={ this.scrollToInputCursor }
              onChangeText={ this.handleChangeComment }
              // value={ isLoadingComment ? null : comment } // HACK React 한글 자모 분리 현상을 수정한다
            />
            {
              isLoadingComment ?
                <Loading />
                :
                <TouchableOpacity onPress={ this.handleClickAddComment }>
                  <AddBtn source={ addImg } />
                </TouchableOpacity>
            }
          </BorderContainer>
        </CommentForm>
      </View>
    )
  }
}


export default connect((state, props) => {  
  return {     
    myUser: getMyUser(state),
  }
}, {
  addComment: entity('comments').addItem
}, (state, dispatch, own) => {
  return {
    ...state,
    ...dispatch,
    ...own,
  }  
})(InputMyComment)
