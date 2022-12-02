pipeline {
	agent any
	
	tools {nodejs "nodejs"}
	
	stages {

		stage("Build Backend"){

			steps {
                sh " rm -rf animatedtalkingheads.api"
			    sh "git clone https://github.com/workshopapps/animatedtalkingheads.api.git"
                dir('animatedtalkingheads.api/node-backend') {
                
                    sh "npm install"
                    sh "npm run build"
                    
                }
			} 
	    }
		stage("Deploy Backend"){

			steps {
                
				sh "sudo cp -fr ${WORKSPACE}/animatedtalkingheads.api/node-backend/* /home/omiebi/voxclips/backend"
				sh "sudo systemctl restart voxclips_api.service"
			} 
	    }
		
    }
}
