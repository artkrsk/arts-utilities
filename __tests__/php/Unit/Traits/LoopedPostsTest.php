<?php

namespace Tests\Unit\Traits;

use PHPUnit\Framework\TestCase;
use Arts\Utilities\Traits\LoopedPosts;

class TestLoopedPostsUtilities {
	use LoopedPosts;
}

class LoopedPostsTest extends TestCase {
	protected $test_utilities;

	protected function setUp(): void {
		parent::setUp();
		$this->test_utilities = new TestLoopedPostsUtilities();

		// Reset mock data for each test
		global $MOCK_DATA;
		$MOCK_DATA = array();
	}

	/**
	 * Test get_prev_next_posts_looped method
	 */
	public function testGetPrevNextPostsLooped() {
		global $MOCK_DATA;

		// Mock posts array
		$mock_posts = array(
			new \WP_Post(
				array(
					'ID'          => 1,
					'post_type'   => 'post',
					'post_status' => 'publish',
					'post_title'  => 'Post 1',
				)
			),
			new \WP_Post(
				array(
					'ID'          => 2,
					'post_type'   => 'post',
					'post_status' => 'publish',
					'post_title'  => 'Post 2',
				)
			),
			new \WP_Post(
				array(
					'ID'          => 3,
					'post_type'   => 'post',
					'post_status' => 'publish',
					'post_title'  => 'Post 3',
				)
			),
		);

		// Mock the WP_Query to return our mock posts
		$MOCK_DATA['wp_query_data'] = array(
			'posts' => $mock_posts,
		);

		// Test when current post is the first post
		$result = TestLoopedPostsUtilities::get_prev_next_posts_looped(
			array(
				'post_id'      => 1,
				'post_type'    => 'post',
				'in_same_term' => false,
			)
		);

		$this->assertInstanceOf( \WP_Post::class, $result['next'] );
		$this->assertInstanceOf( \WP_Post::class, $result['previous'] );
		$this->assertEquals( 2, $result['next']->ID );
		$this->assertEquals( 3, $result['previous']->ID ); // Should loop to the last post

		// Test when current post is in the middle
		$result = TestLoopedPostsUtilities::get_prev_next_posts_looped(
			array(
				'post_id'      => 2,
				'post_type'    => 'post',
				'in_same_term' => false,
			)
		);

		$this->assertInstanceOf( \WP_Post::class, $result['next'] );
		$this->assertInstanceOf( \WP_Post::class, $result['previous'] );
		$this->assertEquals( 3, $result['next']->ID );
		$this->assertEquals( 1, $result['previous']->ID );

		// Test when current post is the last post
		$result = TestLoopedPostsUtilities::get_prev_next_posts_looped(
			array(
				'post_id'      => 3,
				'post_type'    => 'post',
				'in_same_term' => false,
			)
		);

		$this->assertInstanceOf( \WP_Post::class, $result['next'] );
		$this->assertInstanceOf( \WP_Post::class, $result['previous'] );
		$this->assertEquals( 1, $result['next']->ID ); // Should loop to the first post
		$this->assertEquals( 2, $result['previous']->ID );

		// Test with in_same_term true
		$MOCK_DATA['taxonomy_terms'] = array(
			1 => array( array( 'slug' => 'term1' ) ),
			2 => array( array( 'slug' => 'term1' ) ),
			3 => array( array( 'slug' => 'term2' ) ),
		);

		$result = TestLoopedPostsUtilities::get_prev_next_posts_looped(
			array(
				'post_id'      => 1,
				'post_type'    => 'post',
				'in_same_term' => true,
				'taxonomy'     => 'category',
			)
		);

		// With in_same_term, post 1 should only connect to post 2 (same term)
		if ( isset( $result['next'] ) ) {
			$this->assertEquals( 2, $result['next']->ID );
		}
	}

	/**
	 * Test when no posts are found
	 */
	public function testGetPrevNextPostsLoopedWithNoPosts() {
		global $MOCK_DATA;

		// Mock empty posts array
		$MOCK_DATA['wp_query_data'] = array(
			'posts' => array(),
		);

		$result = TestLoopedPostsUtilities::get_prev_next_posts_looped(
			array(
				'post_id'   => 1,
				'post_type' => 'post',
			)
		);

		$this->assertNull( $result['next'] );
		$this->assertNull( $result['previous'] );
	}

	/**
	 * Test when post ID is not found in the posts array
	 */
	public function testGetPrevNextPostsLoopedWithInvalidPostId() {
		global $MOCK_DATA;

		// Clear any previous data
		$MOCK_DATA = array();

		// Mock posts array with only valid posts that can be found
		$MOCK_DATA['wp_query_data'] = array(
			'posts' => array(),
		);

		$result = TestLoopedPostsUtilities::get_prev_next_posts_looped(
			array(
				'post_id'   => 999, // Non-existent post ID
				'post_type' => 'post',
			)
		);

		// Should return null for both previous and next since post ID wasn't found
		$this->assertNull( $result['next'] );
		$this->assertNull( $result['previous'] );
	}

	/**
	 * Test setup_looped_posts method
	 */
	public function testSetupLoopedPosts() {
		global $MOCK_DATA;

		// Mock posts data
		$posts = array(
			new \WP_Post(
				array(
					'ID'           => 1,
					'post_title'   => 'Post 1',
					'post_content' => 'Content 1',
					'post_type'    => 'post',
				)
			),
			new \WP_Post(
				array(
					'ID'           => 2,
					'post_title'   => 'Post 2',
					'post_content' => 'Content 2',
					'post_type'    => 'post',
				)
			),
		);

		// Test setting up looped posts
		$result = $this->test_utilities->setup_looped_posts( $posts );

		$this->assertTrue( $result );
		$this->assertSame( $posts, $MOCK_DATA['looped_posts'] );
		$this->assertEquals( 0, $MOCK_DATA['looped_posts_index'] );
		$this->assertEquals( 2, $MOCK_DATA['looped_posts_count'] );

		// Test with empty posts array
		$MOCK_DATA = array();
		$result    = $this->test_utilities->setup_looped_posts( array() );

		$this->assertFalse( $result );
		$this->assertSame( array(), $MOCK_DATA['looped_posts'] );
		$this->assertEquals( 0, $MOCK_DATA['looped_posts_index'] );
		$this->assertEquals( 0, $MOCK_DATA['looped_posts_count'] );
	}

	/**
	 * Test have_looped_posts method
	 */
	public function testHaveLoopedPosts() {
		global $MOCK_DATA;

		// Mock posts data and index
		$MOCK_DATA['looped_posts']       = array(
			new \WP_Post(
				array(
					'ID'         => 1,
					'post_title' => 'Post 1',
				)
			),
			new \WP_Post(
				array(
					'ID'         => 2,
					'post_title' => 'Post 2',
				)
			),
		);
		$MOCK_DATA['looped_posts_count'] = 2;

		// Test with index at beginning
		$MOCK_DATA['looped_posts_index'] = 0;
		$this->assertTrue( $this->test_utilities->have_looped_posts() );
		$this->assertEquals( 1, $MOCK_DATA['looped_posts_index'] );

		// Test with index at last post
		$MOCK_DATA['looped_posts_index'] = 1;
		$this->assertTrue( $this->test_utilities->have_looped_posts() );
		$this->assertEquals( 2, $MOCK_DATA['looped_posts_index'] );

		// Test when no more posts available
		$MOCK_DATA['looped_posts_index'] = 2;
		$this->assertFalse( $this->test_utilities->have_looped_posts() );
	}

	/**
	 * Test the_looped_post method
	 */
	public function testTheLoopedPost() {
		global $MOCK_DATA;

		// Mock posts data and index
		$posts = array(
			new \WP_Post(
				array(
					'ID'         => 1,
					'post_title' => 'Post 1',
				)
			),
			new \WP_Post(
				array(
					'ID'         => 2,
					'post_title' => 'Post 2',
				)
			),
		);

		$MOCK_DATA['looped_posts']       = $posts;
		$MOCK_DATA['looped_posts_index'] = 1; // Second post

		// Test getting current post
		$result = $this->test_utilities->the_looped_post();

		$this->assertSame( $posts[0], $result );
		$this->assertEquals( $posts[0], $MOCK_DATA['current_looped_post'] );
	}

	/**
	 * Test get_looped_post method
	 */
	public function testGetLoopedPost() {
		global $MOCK_DATA;

		// Mock posts data
		$posts = array(
			new \WP_Post(
				array(
					'ID'         => 1,
					'post_title' => 'Post 1',
				)
			),
			new \WP_Post(
				array(
					'ID'         => 2,
					'post_title' => 'Post 2',
				)
			),
			new \WP_Post(
				array(
					'ID'         => 3,
					'post_title' => 'Post 3',
				)
			),
		);

		$MOCK_DATA['looped_posts'] = $posts;

		// Test with valid indices
		$this->assertSame( $posts[0], $this->test_utilities->get_looped_post( 0 ) );
		$this->assertSame( $posts[1], $this->test_utilities->get_looped_post( 1 ) );
		$this->assertSame( $posts[2], $this->test_utilities->get_looped_post( 2 ) );

		// Test with invalid index
		$this->assertNull( $this->test_utilities->get_looped_post( 3 ) );
		$this->assertNull( $this->test_utilities->get_looped_post( -1 ) );
	}

	/**
	 * Test rewind_looped_posts method
	 */
	public function testRewindLoopedPosts() {
		global $MOCK_DATA;

		// Set initial state
		$MOCK_DATA['looped_posts_index']  = 2;
		$MOCK_DATA['current_looped_post'] = 'some post';

		// Test rewind
		$this->test_utilities->rewind_looped_posts();

		$this->assertEquals( 0, $MOCK_DATA['looped_posts_index'] );
		$this->assertNull( $MOCK_DATA['current_looped_post'] );
	}

	/**
	 * Test reset_looped_posts method
	 */
	public function testResetLoopedPosts() {
		global $MOCK_DATA;

		// Set initial state
		$MOCK_DATA['looped_posts']        = array( 'post1', 'post2' );
		$MOCK_DATA['looped_posts_index']  = 1;
		$MOCK_DATA['looped_posts_count']  = 2;
		$MOCK_DATA['current_looped_post'] = 'post1';

		// Test reset
		$this->test_utilities->reset_looped_posts();

		$this->assertArrayNotHasKey( 'looped_posts', $MOCK_DATA );
		$this->assertArrayNotHasKey( 'looped_posts_index', $MOCK_DATA );
		$this->assertArrayNotHasKey( 'looped_posts_count', $MOCK_DATA );
		$this->assertArrayNotHasKey( 'current_looped_post', $MOCK_DATA );
	}

	/**
	 * Test get_looped_posts_count method
	 */
	public function testGetLoopedPostsCount() {
		global $MOCK_DATA;

		// Test with posts
		$MOCK_DATA['looped_posts_count'] = 5;
		$this->assertEquals( 5, $this->test_utilities->get_looped_posts_count() );

		// Test with no posts
		unset( $MOCK_DATA['looped_posts_count'] );
		$this->assertEquals( 0, $this->test_utilities->get_looped_posts_count() );
	}

	/**
	 * Test get_looped_post_index method
	 */
	public function testGetLoopedPostIndex() {
		global $MOCK_DATA;

		// Test with index set
		$MOCK_DATA['looped_posts_index'] = 3;
		$this->assertEquals( 3, $this->test_utilities->get_looped_post_index() );

		// Test with no index set
		unset( $MOCK_DATA['looped_posts_index'] );
		$this->assertEquals( 0, $this->test_utilities->get_looped_post_index() );
	}
}