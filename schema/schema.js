const graphql = require("graphql");
const _ = require("lodash");
const uuidv1 = require("uuid/v1");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

//TESTING DBs
var truths = [
  { truth: "Do you like someone on this place?", id: "1", authorId: "1" },
  { truth: "Who would you date on this place?", id: "2", authorId: "1" }
];

var dares = [
  {
    dare: "Buy a drink for someone you like in the table",
    id: "1",
    authorId: "2"
  },
  {
    dare: "Drink a shot of alcohol",
    id: "2",
    authorId: "2"
  }
];

var authors = [
  { name: "Eduardo Landa", id: "1" },
  { name: "Gianlucci Minarelli", id: "2" }
];

const DareType = new GraphQLObjectType({
  name: "Dare",
  fields: () => ({
    id: { type: GraphQLID },
    dare: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      }
    }
  })
});

const TruthType = new GraphQLObjectType({
  name: "Truth",
  fields: () => ({
    id: { type: GraphQLID },
    truth: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    dares: {
      type: new GraphQLList(DareType),
      resolve(parent, args) {
        return _.filter(dares, { authorId: parent.id });
      }
    },
    truths: {
      type: new GraphQLList(TruthType),
      resolve(parent, args) {
        return _.filter(truths, { authorId: parent.id });
      }
    }
  })
});

// ROOT QUERY
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    dare: {
      type: DareType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Code to get data from db/other source
        return _.find(dares, { id: args.id });
      }
    },
    truth: {
      type: DareType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Code to get data from db/other source
        return _.find(truths, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    },
    dares: {
      type: new GraphQLList(DareType),
      resolve(parent, args) {
        return dares;
      }
    },
    truths: {
      type: new GraphQLList(TruthType),
      resolve(parent, args) {
        return truths;
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      }
    }
  }
});

//Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let NewAuthor = {
          name: args.name,
          id: uuidv1()
        };
        authors.push(NewAuthor);
        return NewAuthor;
      }
    },
    addDare: {
      type: DareType,
      args: {
        dare: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let newDare = {
          id: uuidv1(),
          dare: args.dare,
          authorId: args.authorId
        };
        dares.push(newDare);
        return newDare;
      }
    },
    addTruth: {
      type: TruthType,
      args: {
        truth: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let newTruth = {
          id: uuidv1(),
          truth: args.truth,
          authorId: args.authorId
        };
        truths.push(newTruth);
        return newTruth;
      }
    },
    removeTruth: {
      type: TruthType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return _.remove(truths, { id: args.id });
      }
    },
    removeDare: {
      type: DareType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return _.remove(dares, { id: args.id });
      }
    },
    removeAuthor: {
      type: AuthorType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return _.remove(authors, { id: args.id });
      }
    },
    updateAuthor: {
      type: AuthorType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const findAuthor = _.find(authors, { id: args.id });
        findAuthor.name = args.name;
        return findAuthor;
      }
    },
    updateTruth: {
      type: TruthType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        truth: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const findTruth = _.find(truths, { id: args.id });
        findTruth.truth = args.truth;
        return findTruth;
      }
    },
    updateDare: {
      type: DareType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        dare: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const findDare = _.find(dares, { id: args.id });
        findDare.dare = args.dare;
        return findDare;
      }
    }
  }
});

//EXPORTING ROOT QUERY
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
