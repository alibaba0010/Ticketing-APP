kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<secret_key>

Build docker image and push to docker hub in client for client and server for tickets

change routes in sign in,up& out, index.js

kubectl get namespacep

to connect to a service on a differnet namespace we use http://NAMEOFSERVICE.NAMESPACE.svc.cluster.local/api/v1/users/currentuser

http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
kubectl get services
kubectl get services -n ingress-nginx-controller
kubectl exec -it pods_name sh
Using npm registry at common lib
Publishing npm registry-- public, private, organization
Pay money or host an open source version of a registry which requires additional setup

client url http://192.168.49.2:31379/
auth-depl http://192.168.49.2:32208

minikube service auth-depl --url
kubectl get namespace
kubectl get services -n ingress-nginx

kubectl get pods -n ingress-inginx
