ARG NODE_ENV
ARG PORT

FROM node:lts-alpine

ENV NODE_ENV=production
ENV PORT=8082
ENV JWT_SECRET=mandorinajayakan
ENV MONGODB_URI=mongodb+srv://kelana-learn1:kelana-learn1@cluster-learn.8zudfto.mongodb.net/prjct9-mandroin
ENV BUCKET_DEV=mandorin-dev
ENV BUCKET_PROD=mandorin-prod

ENV TYPE=service_account
ENV PROJECT_ID=mandorin
ENV PRIVATE_KEY_ID=a98d28a5a9f3b903968c131ec47d6816f7bc838d
ENV PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDAcjwvz+IfM7c8\ncSj+TpD0k/YmPSlaYwDgydAaYuTKguDOsq0jIK0UE+89AwS4sK5kmT0+U/lqf2xm\nTsNGMpkts51g7B6RNjQAfoBtV3k+4TPC8A+G7Mq7jSoT9BYdU131zRFpGF9ThCmk\nxowujJgLA/zXxwAGXWnsEjBC6q7xnswVBtkNBZYOObf1doOWpo/ZEaKGbdefw3zR\npws+wkWYDNlFSDVvxY7+QCpEQq0ETcmTus+lB9poj+c3oOEJ1blgkSPGKxcFRPan\nIzZRoSoW+TdpJji5VlJuxSTA28oI6VAKvxnvKRg79ucoAcz7OkcNeXcP4ZE0NHip\nE67F2VQhAgMBAAECggEAP44acWHSmCJgq83lT2ML/THWM1e0jfyvQA12NBif3X9u\nleStSDIU5tIUis4x43q6BVAUST67Wp/9YSY22DqCmvS8D1O7XpKLhvRAHpwqVwlR\nqlnUjucpptneYRuVqBatq60PSGl7pd26UQgfKIpW9iBZgrteNzvnbMau+JJ/txx5\n5KqcP4FyhuzFAOGmigidJPIgKuRhSXEd134l3jkg8B8Cgn0OQuTy6/FhGCrjzbtW\nCDVZHLWFkXdwifopChTwwsp30KOaZRiwZqzp/H4P+h3D4dp4aejq+jdLHiKDt96J\n55QzGfetXQFAg1ryYBASBiXH3JAjsZLbqd7853Iz5wKBgQD+plObK4G4Je8QmyiN\nZ653vAiNpwOo4dPeOZ0TCxsVssycvsGuNQzTWgc4m+EnghQQtDc52S34LrnNEBMG\n76bPKeZjLkilnoIBZKKkKJjLZMy5ORJS2jvUo3rFeO/1l08geVjl4lQoaV/Jd+VV\n64EoRzalG64Y/DamQmXKJ4NYQwKBgQDBd3h5pANQQB+Bg1oWGWehY4uLGwJ+9jWC\nC7AJaDwQitgPOuVzfrHf+PqCX4bAJo//pUYxoUNAHG6HqlKNS0meWIcnlCXZu+8o\n0Fierm28ixveXzhXxVychZElreUgBriduJWSjFcwaE1ft3Z5QuXSv0jn0eNO2P/9\nUP8nfrZdywKBgBsnCQsmnHJSOSeAI9bQE15ZAmB4Sn+bdMfhRMpfCMhLhF3CSUyW\nA4QVuWdj16Iq0JDnZmwYqDoqYU1oRV8b9qFoSlSQ/tYKDLqxTFZMrd4iJWIqn7WN\n54tI0zJzLsL1G07PIZeBho+4jKoiyqVasy7kSQNZ7Dplyj34HnprtCmZAoGAHeCe\naWKr5FPSycSIQAtyVpkx7qygKQ1K3CeD6x/+zqsyjL+SudBiFe20ejfYbopGCLv0\naCu4YAlEBI2ILCvpVZvkW3dklQiR+aKbXP4hElIFXsUjxWJEWCPEc6Y0UUrYbfsY\nlkY4HNCuyk5h7H4pUe+aibp/OSkH943vqaDG9xsCgYBWBgHnujkQX7klx/x9jil6\nXsnq4c9uTDGSOUZA4mgPy18KVcfjseB+Ftt3P/1Z+gQdPOKt1m31JH0u6GoMNgLd\n++tWpWOlbSmcnFnQEjzpfZByPuFGRyciXeoGJmz/NZOvDS8rxYuHXtYl2k41eib+\nGLweJNhGigrJF2w3AxJRng==\n-----END PRIVATE KEY-----\n"
ENV CLIENT_EMAIL=mandorin-sa@mandorin.iam.gserviceaccount.com
ENV CLIENT_ID=116663700406818878174
ENV AUTH_URI=https://accounts.google.com/o/oauth2/auth
ENV TOKEN_URI=https://oauth2.googleapis.com/token
ENV AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
ENV CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/mandorin-sa%40mandorin.iam.gserviceaccount.com


WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent && mv node_modules ../

COPY . .

EXPOSE 3000

RUN chown -R node /usr/src/app

USER node

CMD ["npm", "start"]

