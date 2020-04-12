/**
 * Custom rules for turning PBS html pages into markdown
 *
 * NOTE: matching on html tags should be done in uppercase
 * regardless of the case in the original html file.
 * Otherwise the match will not be successful.
 */

/**
 * fixCodeBlock
 *
 * fix the code blocks
 *
 * assume they are all crayon formatted and
 * the <textarea> is already converted to <pre><code>
 */

const fixCodeBlock = {
  filter: function (node) {
    return node.className.match('crayon-syntax');
  },
  replacement: function (content, node, options) {
    // console.log('entering the fixCodeBlock rule');

    // find the language in the <span class="crayon-language">JavaScript</span>
    let language = node.querySelector('.crayon-language') || 'html';

    // get the actual code block
    let cb = node.getElementsByTagName('code');
    let codeBlock = cb.length > 0 ? cb[0].textContent : '';

    return (
      `\n\n${options.fence}${language.textContent}\n` +
      codeBlock +
      `\n${options.fence}\n\n`
    );
  }
};

/**
 * removeCrayonTable
 *
 * remove the table that holds the crayon formatted code
 */
const removeCrayonTable = {
  filter: function (node) {
    return node.nodeName === 'TABLE' && node.className === 'crayon-table';
  },
  replacement: function () {
    return '';
  }
};

/**
 * fixCodeSnippets
 *
 * fix the code snippets that are not crayon formatted
 */
const fixCodeSnippets = {
  filter: function (node) {
    return node.nodeName === 'PRE' && node.className.length > 0;
  },
  replacement: function (content, node, options) {
    if (node.className === 'crayon:false') {
      c = node.textContent;
      return (
        `\n\n${options.fence}\n` + node.textContent + `\n${options.fence}\n\n`
      );
    }
  }
};

/**
 * remove an unwanted div.tags_area
 *
 * no idea why I couldn't remove it in prepareBody,
 * but this works just as well
 */
const removeTagsArea = {
  filter: function (node) {
    return node.nodeName === 'DIV' && node.className === 'tags_area';
  },
  replacement: function () {
    return '';
  }
};

/**
 * Fix the title, i.e. lose the link
 */
const fixTitle = {
  filter: function (node) {
    const matching = node.nodeName === 'H1' && node.firstChild.nodeName === 'A';
    return matching;
  },
  replacement: function (content, node, options) {
    let title = node.firstChild.textContent;
    return `\n\n# ${title}\n\n`;
  }
};

/**
 * fix podcast link
 *
 * Mark up the links to the podcast and such so it resembles the
 * section in pbs89 and onwards
 */
const fixPodcastLink = {
  filter: function (node) {
    const matching = node.nodeName === 'DIV' && node.className === 'podcast';
    return matching;
  },
  replacement: function (content, node, options) {
    const ccatpLink = node.getElementsByTagName('A')[0];
    const episodeNumber = ccatpLink.textContent.replace('CCATP Episode ', '');
    let href = ccatpLink.getAttribute('href');
    const audioLink = node
      .getElementsByTagName('AUDIO')[0]
      .getElementsByTagName('A')[0]
      .getAttribute('href');

    const title = `# Matching Postcast Episode ${episodeNumber}`;
    const podcastLink = `[episode ${episodeNumber} of the Chit Chat Across the Pond Podcast](${href})`;
    const audioControls = `<audio controls src="${audioLink}">Your browser does not support HTML 5 audio 🙁</audio>`;
    const downloadLink = `You can also <a href="${audioLink}?autoplay=0&loop=0&controls=1" >Download the MP3</a>`;

    return (
      `\n\n${title}\n\n` +
      `Listen along to this instalment on ${podcastLink}\n\n` +
      `${audioControls}\n\n` +
      `${downloadLink}\n\n`
    );
  }
};

module.exports = [
  {
    name: 'fixCodeBlock',
    rule: fixCodeBlock
  },
  {
    name: 'removeCrayonTable',
    rule: removeCrayonTable
  },
  {
    name: 'fixCodeSnippets',
    rule: fixCodeSnippets
  },
  {
    name: 'removeTagsArea',
    rule: removeTagsArea
  },
  {
    name: 'fixTitle',
    rule: fixTitle
  },
  {
    name: 'fixPodcastLink',
    rule: fixPodcastLink
  }
];
