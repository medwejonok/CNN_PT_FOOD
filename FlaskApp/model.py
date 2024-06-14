import torch
import torch.nn as nn
from torchvision import transforms

from PIL import Image


transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Lambda(lambda x: x.repeat(3, 1, 1) if x.size(0) == 1 else x)
])

class CNN_PH(nn.Module):
    def __init__(self):
        super(CNN_PH, self).__init__()
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=10, kernel_size=3)
        self.pool = nn.MaxPool2d(kernel_size=2)
        self.conv2 = nn.Conv2d(in_channels=10, out_channels=10, kernel_size=3)
        self.conv3 = nn.Conv2d(in_channels=10, out_channels=10, kernel_size=3)
        self.flatten = nn.Flatten()
        self.fc1 = nn.Linear(10 * 30 * 30, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = self.pool(x)
        x = torch.relu(self.conv2(x))
        x = self.pool(x)
        x = torch.relu(self.conv3(x))
        x = self.pool(x)
        x = self.flatten(x)
        x = self.fc1(x)
        x = self.sigmoid(x)
        return x
    
model = CNN_PH()
model.load_state_dict(torch.load('aug_100.pth', map_location=torch.device('cpu')))

def prediction(file) -> int:
    image = Image.open(file)
    tensor = transform(image)
    tensor = tensor.unsqueeze(0)
    output = model(tensor)

    result = (output > 0.5).int()

    print(f"Ответ модели: {result[0][0]}")
    return int(result[0][0])
