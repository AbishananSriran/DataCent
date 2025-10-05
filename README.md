# DataCent
Connect the People - Connect the World.

## Inspiration 🧠

Among any serious company in today's world - strong, interconnected infrastructure is a *must*. But what happens when the need for data centres comes at the cost of accessibility, large budgets, and most importantly, the environment? What differentiates well situated infrastructure from chaotic networks? These are all questions we had when brainstorming on a revolutionary idea to reinvent what it means to have Infrastructure as a Service. We wanted to provide an interactive and effective way for infrastructure leaders and enthusiast to visualize the potential of their infrastructure goals.

While legacy infrastructure is already in place around the world, we aim to picture and convince the next generation of a better future in which connectivity is maximized, costs are minimized, and environmental impacts are taken seriously.  Many studies have long studied the geographical distribution of the data centers, and considering the average data center can consume up to 100 megawatts of power, every optimization counts.

## What it does 😎

DataCent helps you best serve your current and future clients by optimizing data center locations. Whether you are an enthusiast or experienced, DataCent considers every angle of infrastructure, from the proximity to your clients, to the energy saved in comparison to existing or planned infrastructure, to the large cost reductions as a result. Furthermore, using a clever clustering algorithm and through AI feedback, not only will you get the best infrastructure network possible, but also close guidance through AI, making it easy to jumpstart your infrastructure journey. 

Finally, we aim to make this a unique learning experience in which the optimal solutions are compared with user estimations on multiple metrics, while allowing the user to simulate network calls and routing through our models. 

## How we built it 🔧 

DataCent is a web application powered by React, Tailwind and JavaScript on the frontend, while driven by Python, FastAPI, and MongoDB on the backend. We used a variety of useful resources at each stage of our application, from Google Gemini for AI analyses and game plans for our infrastructure models, to AWS Lambda to host our API, to GoDaddy to register and launch our website.

## Challenges we ran into 🚧 

A large challenge we faced involved Cross-Origin Resource Sharing, where we had difficulty connecting to our backend API through our local and production builds. We also had a lot of stylistic and quality of life issues, such as broken buttons or badly formatted components, that we worked on iteratively.

## Accomplishments that we're proud of 🏆

We were able to use K-means clustering to implement optimal network infrastructure, using client nodes as a reference point. This allows for the best network architecture regardless of the geographical distribution of agents. 

Additionally, we implemented multi-layer network routing, using Cloudflare as a reference point, to allow for more granular and industry standard networking architectures.

Finally, the ability to simulate client network calls is a core component of this application, as it allows it to be a powerful demonstration of good architecture, while being a great opportunity to tinker and learn more about networking.
 
## What we learned 💡

What we learned is a reflection of what we overcame through out challenges. Largely, we were able to implement interesting solutions to networking infrastructure problems, such as the K-means algorithm. We also overcame difficulties we faced, such as stylistic issues in our UI, and CORS issues, through debugging sessions.

## What's next for DataCent 🤔

We want to further explore and support spherical coordinates, in turn improving our algorithms to be even faster, more efficient, and creative, allowing for more types of architectural design ideas to flourish. We also want to allow the ability to edit and modify existing network projects, besides deletion. Finally, we'd like to expand our simulation feature to add more complexities, including more users, timed system, and implementing partial or varied sized data centres.
