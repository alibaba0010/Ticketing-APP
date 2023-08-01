kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<secret_key>

Build docker image and push to docker hub

change routes in sign in,up& out

kubectl get namespace

to connect to a service on a differnet namespace we use http://NAMEOFSERVICE.NAMESPACE.svc.cluster.local

http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
kubectl get services
kubectl get services -n ingress-nginx-controller

