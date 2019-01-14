// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, TouchableOpacity, Text, Image } from 'react-native';
import styled from 'styled-components';
import { entity } from 'modules/Entities';
import ProfileImage from 'components/Post/ProfileImage';
import { timestampToDateString } from 'utils/date';
import { heading2BlackExtraBold, gray800, gray600, gray200, gray100, blue600 } from 'constants/Style';
import Reaction from 'components/Post/ReactionWithoutReply';
import { NavigationActions } from 'react-navigation';
import { getDisplayName } from 'utils/string';
import AllComments from 'components/NewsFeed/AllComments';
import InputMyComment from 'components/NewsFeed/InputMyComment';
import ReadMoreButton from 'components/Post/ReadMoreButton';
import ReadMore from 'components/Common/ReadMoreText';
import PlaceholderText from 'components/PlaceholderText';
import LinkableContainer from 'components/Common/LinkableContainer';
import { orderBy } from 'lodash';

//Images
import replyImg from 'images/reply.png';
import unknownImg from "images/ic-unknown.png";
import shadowImg from "images/skeleton-2.png";

const UpperPostPic = styled.View`
  margin-left: 24px;
  margin-right: 24px;
  margin-top: 8px
`;

const NotiLine = styled.View`
  margin-top: 8px;
  margin-bottom: 8px;
  flex-direction: row;
`;

const NotiImg = styled.Image`
  margin-right: 4px
  height: 16px;
  width: 16px;
  tint-color: #459fbf;
`;

const UserName = styled.Text`
  ${heading2BlackExtraBold};
  margin-left: 8px;
  margin-right: 8px;
  fontSize: 11px;
  font-weight: bold;
  line-height: 16px;
  color: ${gray800};
  `;

const AlarmComment = styled.Text`
  fontSize: 14px;
`;

const ProfilePicName = styled.View`
  margin-top: 8px;
`;

const LikeAndReply = styled.View`
  margin-top: 17px;
  margin-bottom: 17px;
`;



const Date = styled.Text`
  margin-left: 8px;
  margin-right: 10px;
  line-height: 16px;
  fontSize: 11px;
  color: ${gray600};
`;

const Loading = styled.ActivityIndicator`
  margin: 24px 0
`;

const PostImage = styled.Image`
  margin-top: 8px;
  margin-bottom: 8px;
  height: 200;
  width: 375;
`;


const DownPostPic = styled.View`
  margin-left: 24px;
  margin-right: 24px;
`;

const PostText = styled(PlaceholderText)`
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 17px;
  color: ${gray800};
`;

const ShowComments = styled.Text`
margin-top: 17px;
fontSize: 14px;
color: ${gray600};
`;

const Rectangle = styled.View`
  width: 360px;
  height: 24px;
`;



class FeedPost extends Component<Props, State> {
  state: State = {
    isLoading: true,
  };

  
  async componentWillMount() {
    const {fetchUser, post} = this.props;
    await fetchUser();
    this.setState(  { isLoading: false });
  }


  handleClickPost = () => {
    const { post, user, navigate } = this.props;
    if (user) {
      const displayName = getDisplayName(user);
      navigate({
        routeName: 'FeedPostDetailScene',
        params: {
          title: displayName ? `${displayName}님의 게시물` : '게시물',
          postId: post.id,
          postUserId: post.userId
        },
      });
    }
  }

  handlePressMore = () => {
    this.onPressMore && this.onPressMore();
  }

  renderContentReadMore(handlePress) {
    return (
      <ReadMoreButton onPress={ handlePress }>전체 보기</ReadMoreButton>
    );
  }

  renderContentShowLess(handlePress) {
    return (
      <ReadMoreButton onPress={ handlePress }>접기</ReadMoreButton>
    );
  }

  _keyExtractor = (item, index) => item.id;
  

  render() {
    console.log('FeedPost this.props : ', this.props)
    console.log('FeedPost this.state : ', this.state)
    const { post, user, name, uId } = this.props;


    const commentsByTime = orderBy(post.comments, ['commentedAt'], ['desc']).slice(0, 3)

    // if (post === null) {
    //   return null;
    if(this.state.Loading === true) {
      return (
      <View style={{flexDirection: 'column'}} > 
      <Image source={shadowImg}/>
      </View>
      )
    } else {

    return (
      <View style={{flexDirection: 'column'}}>

        <UpperPostPic>
          <NotiLine>
          <NotiImg source={replyImg}/>
          <AlarmComment><UserName>{name}</UserName>님이 댓글을 작성했어요.</AlarmComment>
          </NotiLine>
          <ProfilePicName style={{flexDirection: 'row'}}>  
            {user === null ? null : <ProfileImage photoUrl={user.photoUrl} size={ 40 } />}
            <View style={{flexDirection: 'column'}}>
              {user === null ? null : <UserName>{user.name}</UserName>} 
              <Date>{post ? timestampToDateString(post.createdAt) : null}</Date>
            </View>
          </ProfilePicName>
        </UpperPostPic>

        {post.photoUrl && <PostImage source={{ uri: post.photoUrl }} />}
          
        <DownPostPic style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'column', flex:1, flexWrap: 'wrap'}}>
          {/* --------------------post의 content-------------------------------------------- */}
            {/* <Comment>{post.content}}</Comment> */}
            {
               post && Boolean(post.content) &&
               <ReadMore
                 numberOfLines={ 3 }
                 renderTruncatedFooter={ this.renderContentReadMore }
                 renderRevealedFooter={ this.renderContentShowLess }
               >
                 <PostText
                   width={ 128 }
                   height={ 16 }
                   placeholderStyle={{ marginTop: 8 }}
                   placeholderColor={ gray200 }
                   isLoading={ !post }
                 >
                   <LinkableContainer>
                     { post.content.trim() }
                   </LinkableContainer>
                 </PostText>
               </ReadMore>
             }
          {/* --------------------post의 content-------------------------------------------- */}
            {/* -----------------------------좋아요----------------------------------------- */}
            <LikeAndReply>
            {
                post &&
                <Reaction post={ post } comments={post.comments} onClickReply={() => this.handleClickPost(post, user) } />
            }
            </LikeAndReply> 
            {/* -----------------------------좋아요----------------------------------------- */}
          </View>

          <InputMyComment post={post} />

          <FlatList
            data={commentsByTime}
            keyExtractor={this._keyExtractor}
            // enableScrollViewScroll={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              return <AllComments post={post} comment={ item } uId={uId} />
            }}
          />
          {/* {
            commentsByTime.map(comment=><AllComments comment={ comment } key={ comment.id } post={post}/> )
          } */}

          {/* ----------------------------전체 댓글 보기------------------------------------ */}
          {/* 1.새창으로 넘어가서 전체댓글 보여주기 */}
          <TouchableOpacity>
          <ShowComments onPress={() => this.handleClickPost(post, user)}>전체 댓글 보기</ShowComments>
          </TouchableOpacity>  
          {/* 2.현재의 창에서 전체댓글 보여주기 */}
          {/* {
            comments.length > 3 &&
            <ReadMoreButton onPress={ this.handlePressMore }>
              전체 댓글 보기...
            </ReadMoreButton>
          } */}
          {/* ----------------------------전체 댓글 보기------------------------------------ */}
        </DownPostPic>
          <Rectangle />
      </View>
    )}
  }
}


export default connect((state, props) => {  
  return {                            
    user: entity('users').getItem(props.post.userId)(state),
  }
}, {
  fetchUser: entity('users').fetchItem,
  navigate: NavigationActions.navigate,
}, (state, dispatch, own) => {
  return {
    ...state,
    ...dispatch,
    ...own,
    fetchUser: () => dispatch.fetchUser(own.post.userId),
  }  
})(FeedPost)
