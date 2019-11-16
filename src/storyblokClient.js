import StoryblokClient from 'storyblok-js-client';

const client = new StoryblokClient({
  accessToken: 'gGkoqNNJXFUMVRjU8PUahgtt-48238-9s1MvVP3GymLUqHpBYt2'
})

export const defaultRequestConfig = {
  version: 'draft'
}

export default client