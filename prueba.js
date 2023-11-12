const soap = require('soap');
var express = require('express');
var app = express();
const port = 3050;
const wsdlUrl = "http://soapnode:3010/wsdl?wsdl"; 

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:2512');
  // You can set other CORS headers as needed
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const createClientAsync = async () => {
  try {
    const client = await soap.createClientAsync(wsdlUrl);
    return client;
  } catch (error) {
    console.error('Error creating SOAP client:', error);
    throw error;
  }
};

const postNotification = async (plate, message) => {
  const client = await createClientAsync();

  const args = {
    plate: plate,
    message: message
  };

  return new Promise((resolve, reject) => {
    client.post_notification(args, (err, result) => {
      if (err) {
        console.error('Error calling post_notification:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getNotification = async (plate) => {
  const client = await createClientAsync();

  const args = {
    plate: plate
  };

  return new Promise((resolve, reject) => {
    client.get_notification(args, (err, result) => {
      if (err) {
        console.error('Error calling get_notification:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
app.get('/notification/:plate', async function(req, res){
	try {
    const plate = req.params.plate;
    const getResult = await getNotification(plate);
    console.log('get_notification Result:', getResult);
    res.status(200).json({ notifications: getResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});
app.post('/notification', async function(req, res){
  const date = new Date();
  const dias = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
  const mensajes =["Cree en ti mismo","Tu puedes con todo","Animo","Eres el mejor","Ya falta poco","Te admiro mucho","Eres unico"];
  try {
    
    const plate= dias[date.getDay()]
    const message = mensajes[date.getDay()]
    const postResult = await postNotification(plate, message);
    console.log('post_notification Result:', postResult);
    res.status(200).json({ notifications: postResult });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear notificaciones' });
  }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

