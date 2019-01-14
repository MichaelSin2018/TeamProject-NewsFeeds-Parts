// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, SafeAreaView } from 'react-native';
import styled from 'styled-components';
import { entity } from 'modules/Entities';
import { heading2BlackExtraBold } from 'constants/Style';
import { orderBy } from 'lodash';
import FeedCommentItem from 'components/NewsFeed/FeedCommentItem';


const Container = styled.View`
  position: relative;
  flex: 1;
  height: 100%;
  `;

const Loading = styled.ActivityIndicator`
  margin: 24px 0
`;


class FeedCommentList extends Component<Props, State> {
  state: State = {
    isLoading: true,
    number: 6
  };
  
  async componentWillMount() {  // user or not async, await
    const { fetchCommentsListByUserId, myCreatorsId } = this.props 
    for(var i = 0; i < myCreatorsId.length; i++) {
      await fetchCommentsListByUserId(myCreatorsId[i])() //2. 나의 크레이터가 작성한 comments의 포스팅
   }
    this.setState({ isLoading: false });
  }

  roadMore = () => {
    this.setState({number: this.state.number + 6})
  }

  _keyExtractor = (item, index) => item.id;
 

  render() {

    const { commentsByMyCreators, uId} = this.props;
    const commentsByTime = orderBy(commentsByMyCreators, ['commentedAt'], ['desc']).slice(0, this.state.number)

    if (!commentsByTime || commentsByTime.length <= 0 || typeof commentsByTime === "undefined") {
      return <Loading />;
    }

      return (
        <SafeAreaView style={{flex: 1}}>
          <Container>
            <FlatList
              data={commentsByTime}
              keyExtractor={this._keyExtractor}
              onEndReached={this.roadMore}
              legacyImplementation={true}
              onEndReachedThreshold={0}
              renderItem={({item}) => {
                return <FeedCommentItem comment={ item } uId={uId} />
              }}
            />
          </Container>
        </SafeAreaView>
      );
    
  }
}

export default connect((state, props) => {  
  return {                            
  myCreatorsId: props.creatorList,
  commentsByMyCreators: entity("comments").getQueriedList("commentsList")(state),
  }
}, {
  fetchCommentsList: entity("comments").queryList, 
}, (state, dispatch, own) => {
  return {
    ...state,
    ...dispatch,
    ...own,
    fetchCommentsListByUserId: (id) => dispatch.fetchCommentsList("commentsList", [['userId', '==', `${id}`]]),
  }  
})(FeedCommentList)

