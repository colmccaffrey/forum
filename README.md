# forum

FORUM

An application where users can join in discussions on specific topics or create their own.

---------------------------------------------

USER STORIES:

*Create user profile with username and image
*Choose whether to create a new topic or comment on an existing one
*Can sort topics by popularity
*Vote on existing topics 
*Can use the application on mobile devices
*User can see list of user activity by topics created and comments made

**********Potential features***********

*gravatar api integration
*geolocation comment tagging
*markdown fromatting


____________________________________
RESTFUL ROUTES:


*Choose whether to create a new topic, go to list of topics, or see all popular topics
	'/forum'
*list of existing topics, option to vote, add new
	'/forum/topics'
*Individual topic- with list of discussions in topic- option to create new discussion or comment on existing one
	'/forum/topic_name'
*individual discussion within a topic- option to comment
 '/forum/topic_name/discussion_name'
*Can sort topics by popularity
	'/forum/popular'

*Can use the application on mobile devices
*User can see list of user activity by topics created, discussions joined, comments made
*see user content by topics and discussions created and comments left (with associated discussion/topic)- other users can see this page too
	'/forum/user_name' (profile and list of activity)
*Create user profile with username and imgage
	'/forum/user_name/new'

