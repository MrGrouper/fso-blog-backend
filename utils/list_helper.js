const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) =>{
  const sum = blogs.reduce((acc, obj) => {
    return acc + obj.likes;
  }, 0);
  return sum;
};

module.exports = {
  dummy,
  totalLikes
}
