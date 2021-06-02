import './styles.css';
import { Component } from 'react';
import { loadPosts } from '../../utils/loadPosts';

import { Posts } from '../../Components/Posts';
import { Button } from '../../Components/Button';
import { TextInput } from '../../Components/TextInput';

export class Home extends Component {

  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPages: 10,
    searchValue: '',
  }

  componentDidMount() {
      this.loadPosts();
  }

  loadPosts = async () => {

    const { page, postsPerPages } = this.state;

    const postsAndPhotos = await loadPosts();

    this.setState({ 
      posts: postsAndPhotos.slice(page, postsPerPages),
      allPosts: postsAndPhotos,

    });
  }

  loadMorePosts = () => {
    const {
      page,
      postsPerPages,
      allPosts,
      posts
    } = this.state;

    const nextPage = page + postsPerPages;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPages);
    posts.push(...nextPosts);

    this.setState({posts, page: nextPage });
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  }

  render() {

    const { posts, page, postsPerPages, allPosts, searchValue } = this.state;

    const noMorePosts = page + postsPerPages >= allPosts.length;

    const filteredPosts = !!searchValue ? allPosts.filter(post => {
      return post.title.toLowerCase().includes(
        searchValue.toLowerCase());
    }) 
    : posts;

    return (
      <section className='container'> 
        <div className='search-input'>
          {!!searchValue && (
              <h1>Search Value: {searchValue}</h1>
          )}

        <TextInput searchValue={searchValue} handleChange={this.handleChange}/>
        </div>
        

        {filteredPosts.length > 0 && (
          <Posts posts={filteredPosts}/>
        )}

        {filteredPosts.length === 0 && (
          <p>Não existem posts!</p>
        )}  
        
        <div className='button-container'> 
         {!searchValue && (
            <Button 
            text='Load more posts'
            onClick={this.loadMorePosts}
            disabled={noMorePosts}
          />
         )}
        </div>
      </section>
    );
  }
}
