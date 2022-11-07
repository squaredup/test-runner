import global from 'global';
export const setPreRender = preRender => {
  global.__sbPreRender = preRender;
};
export const setPostRender = postRender => {
  global.__sbPostRender = postRender;
};
export const getStoryContext = async (page, context) => {
  // @ts-ignore
  return page.evaluate(({
    storyId
  }) => globalThis.__getContext(storyId), {
    storyId: context.id
  });
};