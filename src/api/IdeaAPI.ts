import {
  CurrentUser,
  Idea,
  IdeaAPIResponse,
  IdeaDetails,
  IdeaStatus,
  ProductRequest,
} from "../interfaces/Idea";

import { IdeaModel, UserModel } from "../models/IdeaModel";
import { Document } from "mongoose";

async function getIdeaList(
  query?: string,
  sortBy?: string,
  status?: IdeaStatus
): Promise<Idea[]> {
  let filter: any = {};

  if (status) {
    filter.status = status;
  }
  if (query && query !== "All") {
    filter.category = query;
  }

  const ideas = await IdeaModel.find(filter).exec();

  const sortedIdeas = sortBy
    ? ideas.sort((a: Document, b: Document) => {
        const prA = a.toObject() as ProductRequest;
        const prB = b.toObject() as ProductRequest;
        return sortByVotesOrComments(sortBy, prA, prB);
      })
    : ideas;

  return adaptProductRequestsToIdeaList(sortedIdeas as any);
}

async function getIdeaById(id: string): Promise<IdeaDetails> {
  const filter = { id: id };
  const idea = await IdeaModel.findOne(filter).exec();
  return adaptProductRequestToIdeaDetails(idea as any);
}

async function updateIdeaById(id: string, ideaUpdated: Idea): Promise<Idea> {
  const filter = { id: id };
  const productRequestDoc = await IdeaModel.findOneAndUpdate(
    filter,
    ideaUpdated,
    {
      new: true,
    }
  ).exec();
  if (!productRequestDoc) {
    throw new Error(`Idea item with id ${id} was not found`);
  }
  const productRequestItem = productRequestDoc.toObject() as Idea;
  return productRequestItem;
}

async function updateCurrentUser(
  userId: string,
  currentUserUpdated: CurrentUser
): Promise<CurrentUser> {
  // Find the user by ID and update
  const updatedUserDoc = await UserModel.findByIdAndUpdate(
    userId,
    currentUserUpdated,
    { new: true }
  ).exec();

  // Check if the user was successfully updated
  if (!updatedUserDoc) {
    throw new Error("Failed to update user");
  }

  // Convert the Mongoose document to a plain JavaScript object and cast it to CurrentUser
  const updatedUser = updatedUserDoc.toObject() as CurrentUser;

  // Optionally, you can update the local storage as well
  const dataStr: string = localStorage.getItem("data") ?? "";
  const data: IdeaAPIResponse = JSON.parse(dataStr ?? "");
  data.currentUser = updatedUser;
  localStorage.setItem("data", JSON.stringify(data));

  return updatedUser;
}

async function addNewIdea(idea: Idea): Promise<Idea> {
  const newIdeaDoc = new IdeaModel(idea);
  await newIdeaDoc.save();
  const newIdea = newIdeaDoc.toObject() as Idea;
  return newIdea;
}

async function deleteIdea(id: string): Promise<string> {
  const deletedIdea = await IdeaModel.findOneAndDelete({ id: id }).exec();
  if (!deletedIdea) {
    throw new Error(`Idea item with id ${id} was not found`);
  }
  return `Idea item with id: ${id} was successfully deleted.`;
}

// Helpers
function sortByVotesOrComments(
  sortBy: string,
  prA: ProductRequest,
  prB: ProductRequest
) {
  const prAComments = prA.comments?.length ?? 0;
  const prBComments = prB.comments?.length ?? 0;

  switch (sortBy) {
    case "moreVotes":
      return prB.upvotes - prA.upvotes;

    case "lessVotes":
      return prA.upvotes - prB.upvotes;
    case "moreComments":
      return prBComments - prAComments;

    case "lessComments":
      return prAComments - prBComments;

    default:
      return prB.upvotes - prA.upvotes;
  }
}

// Adapters

function adaptProductRequestToIdeaDetails(
  productRequest: ProductRequest
): IdeaDetails {
  return {
    id: productRequest.id,
    title: productRequest.title,
    description: productRequest.description,
    category: productRequest.category,
    status: productRequest.status,
    upvotes: productRequest.upvotes,
    // upVoted: false,
    commentCount: productRequest.comments?.length ?? 0, // FIXME: this has to include replies too
    comments: productRequest.comments,
  };
}

function adaptProductRequestToIdea(productRequest: ProductRequest): Idea {
  return {
    id: productRequest.id,
    title: productRequest.title,
    description: productRequest.description,
    category: productRequest.category,
    status: productRequest.status,
    upvotes: productRequest.upvotes,
    // upVoted: false,
    commentCount: productRequest.comments?.length ?? 0,
  };
}

function adaptProductRequestsToIdeaList(
  productRequests: ProductRequest[]
): Idea[] {
  return productRequests.map((productRequest) => {
    return adaptProductRequestToIdea(productRequest);
  });
}
export {
  getIdeaList,
  getIdeaById,
  addNewIdea,
  updateIdeaById,
  updateCurrentUser,
  deleteIdea,
};
