class MediaCounter:
	def __init__(self, count=0):
		self.counter = count

	def increment(self):
		# global counter
		self.counter += 1