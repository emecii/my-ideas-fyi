import {
  CurrentUser,
  Idea,
  IdeaAPIResponse,
  IdeaDetails,
  IdeaStatus,
  ProductRequest,
} from "src/interfaces/Idea";

async function getIdeaList(
  query?: string,
  sortBy?: string,
  status?: IdeaStatus
): Promise<Idea[]> {
  const dataStr: string = localStorage.getItem("data") ?? "";
  const data: IdeaAPIResponse = JSON.parse(dataStr ?? "");
  const productRequests: ProductRequest[] = data.productRequests.filter(
    (pr) => {
      let validPR = true;
      if (status) {
        validPR = pr.status.toLowerCase() === status.toLowerCase();
      }
      if (query && query !== "All" && validPR) {
        validPR = pr.category.toLowerCase() === query.toLowerCase();
      }
      return validPR;
    }
  );
  const sortedProductRequests = sortBy
    ? productRequests.sort((prA, prB) => {
        return sortByVotesOrComments(sortBy, prA, prB);
      })
    : productRequests;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(adaptProductRequestsToIdeaList(sortedProductRequests));
    }, 1000);
  });
}

async function getCurrentUser(): Promise<CurrentUser> {
  const dataStr: string = localStorage.getItem("data") ?? "";
  const data: IdeaAPIResponse = JSON.parse(dataStr ?? "");
  const currentUser = data.currentUser;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(currentUser);
    }, 1000);
  });
}

async function getIdeaById(
  id: string | undefined
): Promise<IdeaDetails> {
  if (id === undefined) {
    throw new Error("There was no id provided to get the idea item.");
  }
  const dataStr: string = localStorage.getItem("data") ?? "";
  const data: IdeaAPIResponse = JSON.parse(dataStr ?? "");
  const productRequests: ProductRequest[] = data.productRequests;
  const productRequestItem = productRequests.find((pr) => pr.id === id) ?? null;
  if (productRequestItem === null) {
    throw new Error(`Idea item with id ${id} was not found`);
  }
  // TODO: Implement rejection too
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(adaptProductRequestToIdeaDetails(productRequestItem));
    }, 1000);
  });
}

async function updateIdeaById(
  id: string | undefined,
  ideaUpdated: Idea
): Promise<Idea> {
  if (id === undefined) {
    throw new Error("There was no id provided to get the idea item.");
  }
  const dataStr: string = localStorage.getItem("data") ?? "";
  const data: IdeaAPIResponse = JSON.parse(dataStr ?? "");
  const productRequests: ProductRequest[] = data.productRequests;
  const productRequestItem = productRequests.find((pr) => pr.id === id) ?? null;
  if (productRequestItem === null) {
    throw new Error(`Idea item with id ${id} was not found`);
  }
  Object.assign(productRequestItem, ideaUpdated);
  localStorage.setItem("data", JSON.stringify({ ...data, productRequests }));
  // TODO: Implement rejection too
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productRequestItem as IdeaDetails);
    }, 1000);
  });
}

async function updateCurrentUser(
  currentUserUpdated: CurrentUser
): Promise<CurrentUser> {
  const dataStr: string = localStorage.getItem("data") ?? "";
  const data: IdeaAPIResponse = JSON.parse(dataStr ?? "");
  const currentUser = data.currentUser;

  Object.assign(currentUser, currentUserUpdated);
  localStorage.setItem("data", JSON.stringify({ ...data, currentUser }));
  // TODO: Implement rejection too
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(productRequestItem as IdeaDetails);
  //   }, 1000);
  // });
  return currentUser;
}

async function addNewIdea(idea: Idea): Promise<ProductRequest> {
  const dataStr: string = localStorage.getItem("data") ?? "";
  const data: IdeaAPIResponse = JSON.parse(dataStr ?? "");
  const productRequests: ProductRequest[] = data.productRequests;
  const productRequest = {
    ...idea,
    comments: [],
  } as ProductRequest;

  localStorage.setItem(
    "data",
    JSON.stringify({
      ...data,
      productRequests: [productRequest, ...productRequests],
    })
  );
  // TODO: Implement rejection too
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(idea);
    }, 1000);
  });
}

async function deleteIdea(id: string | undefined) {
  if (id === undefined) {
    throw new Error("There was no id provided to get the idea item.");
  }
  const dataStr: string = localStorage.getItem("data") ?? "";
  const data: IdeaAPIResponse = JSON.parse(dataStr ?? "");
  const productRequests: ProductRequest[] = data.productRequests.filter(
    (pr) => pr.id !== id
  );

  localStorage.setItem("data", JSON.stringify({ ...data, productRequests }));
  // TODO: Implement rejection too
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Idea item with id: ${id} was successfully deleted.`);
    }, 1000);
  });
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

function adaptProductRequestToIdea(
  productRequest: ProductRequest
): Idea {
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
  getCurrentUser,
  getIdeaById,
  addNewIdea,
  updateIdeaById,
  updateCurrentUser,
  deleteIdea,
};
